// Migration script to link legacy projects to client companies
// This script migrates projects from using client_id (users) to client_company_id (companies)

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateProjectsToClientCompanies() {
  try {
    console.log('🔄 Starting project-to-client-company migration...\n');

    // Step 1: Get all legacy projects (those using client_id)
    const { data: legacyProjects } = await supabase
      .from('projects')
      .select('id, name, client_id')
      .not('client_id', 'is', null)
      .is('client_company_id', null);

    if (!legacyProjects || legacyProjects.length === 0) {
      console.log('✅ No legacy projects found. All projects are already using client companies.');
      return;
    }

    console.log(`📋 Found ${legacyProjects.length} legacy projects to migrate:`);
    legacyProjects.forEach(p => console.log(`- ${p.name}`));
    console.log('');

    // Step 2: Get user information for those client_ids
    const clientUserIds = [...new Set(legacyProjects.map(p => p.client_id))];
    const { data: clientUsers } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, role')
      .in('id', clientUserIds);

    console.log('👥 Legacy client users:');
    clientUsers?.forEach(u => console.log(`- ${u.full_name} (${u.email}) - Role: ${u.role}`));
    console.log('');

    // Step 3: For each legacy client user, create a corresponding client company
    const userToCompanyMap = new Map();

    for (const user of clientUsers || []) {
      // Create a client company for this user
      const companyName = `MIGRATED_${user.full_name?.replace(/\s+/g, '_') || 'Unknown'}_Company`;
      
      console.log(`🏢 Creating client company for ${user.full_name}...`);

      // Create company
      const { data: newCompany, error: companyError } = await supabase
        .from('client_companies')
        .insert({
          company_name: companyName,
          industry: 'Professional Services',
          email: user.email,
          status: 'active'
        })
        .select()
        .single();

      if (companyError) {
        console.error(`❌ Error creating company for ${user.full_name}:`, companyError);
        continue;
      }

      // Create owner contact
      const { data: ownerContact, error: contactError } = await supabase
        .from('client_contacts')
        .insert({
          client_company_id: newCompany.id,
          full_name: user.full_name || 'Unknown',
          email: user.email || '',
          role: 'owner',
          is_primary_contact: true,
          can_manage_team: true
        })
        .select()
        .single();

      if (contactError) {
        console.error(`❌ Error creating owner contact for ${user.full_name}:`, contactError);
        continue;
      }

      // Update company with owner contact ID
      await supabase
        .from('client_companies')
        .update({ owner_contact_id: ownerContact.id })
        .eq('id', newCompany.id);

      userToCompanyMap.set(user.id, newCompany.id);
      console.log(`✅ Created company "${companyName}" for ${user.full_name}`);
    }

    console.log(`\n📊 Created ${userToCompanyMap.size} client companies\n`);

    // Step 4: Update projects to use client_company_id instead of client_id
    let migratedCount = 0;
    
    for (const project of legacyProjects) {
      const clientCompanyId = userToCompanyMap.get(project.client_id);
      
      if (clientCompanyId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            client_company_id: clientCompanyId,
            client_id: null, // Clear the legacy field
            updated_at: new Date().toISOString()
          })
          .eq('id', project.id);

        if (updateError) {
          console.error(`❌ Error updating project ${project.name}:`, updateError);
        } else {
          console.log(`✅ Migrated project: ${project.name}`);
          migratedCount++;
        }
      } else {
        console.log(`⚠️  Skipped project ${project.name} - no company mapping found`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Summary:`);
    console.log(`- Legacy projects found: ${legacyProjects.length}`);
    console.log(`- Client companies created: ${userToCompanyMap.size}`);
    console.log(`- Projects migrated: ${migratedCount}`);
    console.log(`\n🏷️  All migrated companies have "MIGRATED_" prefix for easy identification`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Rollback function to undo the migration if needed
async function rollbackMigration() {
  try {
    console.log('🔄 Rolling back migration...\n');

    // Delete migrated companies and their contacts
    const { data: migratedCompanies } = await supabase
      .from('client_companies')
      .select('id')
      .like('company_name', 'MIGRATED_%');

    if (migratedCompanies && migratedCompanies.length > 0) {
      await supabase
        .from('client_contacts')
        .delete()
        .in('client_company_id', migratedCompanies.map(c => c.id));

      await supabase
        .from('client_companies')
        .delete()
        .like('company_name', 'MIGRATED_%');

      console.log(`✅ Removed ${migratedCompanies.length} migrated companies`);
    }

    // Note: Projects will need manual client_id restoration if needed
    console.log('⚠️  Projects client_company_id fields left as-is. Manual restoration needed if required.');
    console.log('✅ Rollback completed');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
  }
}

// Run based on command line argument
const command = process.argv[2];
if (command === 'rollback') {
  rollbackMigration();
} else {
  migrateProjectsToClientCompanies();
}

module.exports = { migrateProjectsToClientCompanies, rollbackMigration };