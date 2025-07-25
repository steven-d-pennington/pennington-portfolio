// Fix user roles and ensure correct test users exist
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUserRoles() {
  console.log('🔧 Fixing user roles and ensuring test users exist...\n');

  try {
    // 1. Check and create admin user steven@spennington.dev if needed
    console.log('1. Checking admin user: steven@spennington.dev');
    const { data: adminAuthUser } = await supabase.auth.admin.listUsers();
    const adminExists = adminAuthUser.users.find(u => u.email === 'steven@spennington.dev');
    
    if (!adminExists) {
      console.log('   Creating admin user...');
      const { data: newAdmin, error: createError } = await supabase.auth.admin.createUser({
        email: 'steven@spennington.dev',
        password: 'StarDust',
        email_confirm: true,
        user_metadata: {
          full_name: 'Steven Pennington',
          role: 'admin'
        }
      });
      
      if (createError) {
        console.error('   ❌ Failed to create admin user:', createError.message);
      } else {
        console.log('   ✅ Admin user created');
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: newAdmin.user.id,
            email: 'steven@spennington.dev',
            full_name: 'Steven Pennington',
            role: 'admin',
            status: 'active'
          });
          
        if (profileError) {
          console.error('   ❌ Failed to create admin profile:', profileError.message);
        } else {
          console.log('   ✅ Admin profile created');
        }
      }
    } else {
      console.log('   ✅ Admin user already exists');
      
      // Update role to admin if needed
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', adminExists.id)
        .single();
        
      if (profile?.role !== 'admin') {
        const { error } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('id', adminExists.id);
          
        if (error) {
          console.error('   ❌ Failed to update admin role:', error.message);
        } else {
          console.log('   ✅ Updated to admin role');
        }
      }
    }

    // 2. Fix stevepenn@hotmail.com role (user -> team_member)
    console.log('\n2. Fixing stevepenn@hotmail.com role');
    const { data: teamUser } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('email', 'stevepenn@hotmail.com')
      .single();
      
    if (teamUser) {
      if (teamUser.role === 'user') {
        const { error } = await supabase
          .from('user_profiles')
          .update({ role: 'team_member' })
          .eq('id', teamUser.id);
          
        if (error) {
          console.error('   ❌ Failed to update team member role:', error.message);
        } else {
          console.log('   ✅ Updated stevepenn@hotmail.com: user → team_member');
        }
      } else {
        console.log('   ✅ stevepenn@hotmail.com role already correct:', teamUser.role);
      }
    } else {
      console.log('   ❌ stevepenn@hotmail.com not found in user_profiles');
    }

    // 3. Verify client user exists and is properly configured
    console.log('\n3. Verifying client@monkeylovestack.com');
    const { data: clientContact } = await supabase
      .from('client_contacts')
      .select(`
        id, email, role, client_company_id,
        client_companies:client_company_id (company_name)
      `)
      .eq('email', 'client@monkeylovestack.com')
      .single();
      
    if (clientContact) {
      console.log('   ✅ Client user exists');
      console.log('   📧 Email:', clientContact.email);
      console.log('   👤 Role:', clientContact.role);
      console.log('   🏢 Company:', clientContact.client_companies?.company_name);
    } else {
      console.log('   ❌ Client user not found');
    }

    // 4. Summary of test users
    console.log('\n📋 Test User Summary:');
    console.log('═══════════════════════════════════════');
    console.log('Admin (Full Access):');
    console.log('  📧 steven@spennington.dev');
    console.log('  🔑 StarDust');
    console.log('  👤 Role: admin');
    console.log('');
    console.log('Team Member (Limited Access):');
    console.log('  📧 stevepenn@hotmail.com');
    console.log('  🔑 StarDust');
    console.log('  👤 Role: team_member');
    console.log('');
    console.log('Client (Company-Scoped):');
    console.log('  📧 client@monkeylovestack.com');
    console.log('  🔑 StarDust');
    console.log('  👤 Role: owner');
    console.log('  🏢 Company: Test Company Inc');
    console.log('');

    console.log('✅ User role fixing complete!');
    
  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  }
}

fixUserRoles();