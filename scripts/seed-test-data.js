// Test data seeding script for comprehensive system testing
// All data uses "TEST_" prefixes for easy identification and cleanup

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test client companies data
const testCompanies = [
  {
    company_name: 'TEST_Acme Corporation',
    industry: 'Manufacturing',
    website: 'https://test-acme.example.com',
    address: '123 Test Industrial Blvd, Test City, TX 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@test-acme.example.com',
    billing_address: '123 Test Industrial Blvd, Test City, TX 12345',
    tax_id: 'TEST-12-3456789',
    status: 'active',
    owner: {
      full_name: 'TEST_John Smith',
      email: 'john.smith@test-acme.example.com',
      phone: '+1 (555) 123-4570',
      title: 'CEO',
      department: 'Executive'
    },
    contacts: [
      {
        full_name: 'TEST_Sarah Johnson',
        email: 'sarah.johnson@test-acme.example.com',
        phone: '+1 (555) 123-4571',
        title: 'CTO',
        department: 'Technology',
        role: 'tech'
      },
      {
        full_name: 'TEST_Mike Davis',
        email: 'mike.davis@test-acme.example.com',
        phone: '+1 (555) 123-4572',
        title: 'Marketing Director',
        department: 'Marketing',
        role: 'media'
      }
    ]
  },
  {
    company_name: 'TEST_TechStart Solutions',
    industry: 'Technology',
    website: 'https://test-techstart.example.com',
    address: '456 Test Innovation Way, Silicon Test Valley, CA 94000',
    phone: '+1 (555) 234-5678',
    email: 'hello@test-techstart.example.com',
    billing_address: '456 Test Innovation Way, Silicon Test Valley, CA 94000',
    tax_id: 'TEST-23-4567890',
    status: 'active',
    owner: {
      full_name: 'TEST_Emma Wilson',
      email: 'emma.wilson@test-techstart.example.com',
      phone: '+1 (555) 234-5680',
      title: 'Founder & CEO',
      department: 'Executive'
    },
    contacts: [
      {
        full_name: 'TEST_Alex Chen',
        email: 'alex.chen@test-techstart.example.com',
        phone: '+1 (555) 234-5681',
        title: 'Lead Developer',
        department: 'Engineering',
        role: 'tech'
      },
      {
        full_name: 'TEST_Lisa Rodriguez',
        email: 'lisa.rodriguez@test-techstart.example.com',
        phone: '+1 (555) 234-5682',
        title: 'CFO',
        department: 'Finance',
        role: 'finance'
      }
    ]
  },
  {
    company_name: 'TEST_Global Retail Inc',
    industry: 'Retail',
    website: 'https://test-globalretail.example.com',
    address: '789 Test Commerce Plaza, New Test York, NY 10001',
    phone: '+1 (555) 345-6789',
    email: 'info@test-globalretail.example.com',
    billing_address: 'PO Box 12345, New Test York, NY 10001',
    tax_id: 'TEST-34-5678901',
    status: 'prospect',
    owner: {
      full_name: 'TEST_Robert Brown',
      email: 'robert.brown@test-globalretail.example.com',
      phone: '+1 (555) 345-6790',
      title: 'VP of Digital Transformation',
      department: 'Strategy'
    },
    contacts: [
      {
        full_name: 'TEST_Jennifer Lee',
        email: 'jennifer.lee@test-globalretail.example.com',
        phone: '+1 (555) 345-6791',
        title: 'IT Director',
        department: 'Information Technology',
        role: 'tech'
      },
      {
        full_name: 'TEST_David Kim',
        email: 'david.kim@test-globalretail.example.com',
        phone: '+1 (555) 345-6792',
        title: 'Brand Manager',
        department: 'Marketing',
        role: 'media'
      },
      {
        full_name: 'TEST_Amanda White',
        email: 'amanda.white@test-globalretail.example.com',
        phone: '+1 (555) 345-6793',
        title: 'Controller',
        department: 'Accounting',
        role: 'finance'
      }
    ]
  }
];

// Test projects data
const testProjects = [
  {
    name: 'TEST_Acme Digital Platform',
    description: 'Complete digital transformation platform for manufacturing operations including inventory management, production tracking, and customer portal.',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    estimated_hours: 480,
    hourly_rate: 125.00,
    github_repo_url: 'https://github.com/test-company/acme-platform',
    github_repo_name: 'acme-platform',
    github_default_branch: 'main'
  },
  {
    name: 'TEST_TechStart Mobile App',
    description: 'Native iOS and Android application for startup ecosystem with social features, networking, and event management.',
    status: 'active',
    start_date: '2024-02-01',
    end_date: '2024-08-15',
    estimated_hours: 640,
    hourly_rate: 135.00,
    github_repo_url: 'https://github.com/test-company/techstart-mobile',
    github_repo_name: 'techstart-mobile',
    github_default_branch: 'develop'
  },
  {
    name: 'TEST_Global Retail E-commerce',
    description: 'Modern e-commerce platform with advanced analytics, inventory management, and multi-channel integration.',
    status: 'planning',
    start_date: '2024-03-01',
    end_date: '2024-12-31',
    estimated_hours: 960,
    fixed_price: 89999.99,
    github_repo_url: 'https://github.com/test-company/global-retail-ecommerce',
    github_repo_name: 'global-retail-ecommerce',
    github_default_branch: 'main'
  }
];

async function createCompanyWithContacts(companyData) {
  console.log(`Creating company: ${companyData.company_name}`);
  
  // 1. Create company
  const { data: company, error: companyError } = await supabase
    .from('client_companies')
    .insert({
      company_name: companyData.company_name,
      industry: companyData.industry,
      website: companyData.website,
      address: companyData.address,
      phone: companyData.phone,
      email: companyData.email,
      billing_address: companyData.billing_address,
      tax_id: companyData.tax_id,
      status: companyData.status
    })
    .select()
    .single();

  if (companyError) {
    console.error('Error creating company:', companyError);
    return null;
  }

  // 2. Create owner contact
  const { data: ownerContact, error: ownerError } = await supabase
    .from('client_contacts')
    .insert({
      client_company_id: company.id,
      full_name: companyData.owner.full_name,
      email: companyData.owner.email,
      phone: companyData.owner.phone,
      title: companyData.owner.title,
      department: companyData.owner.department,
      role: 'owner',
      is_primary_contact: true,
      can_manage_team: true
    })
    .select()
    .single();

  if (ownerError) {
    console.error('Error creating owner contact:', ownerError);
    return null;
  }

  // 3. Update company with owner contact ID
  await supabase
    .from('client_companies')
    .update({ owner_contact_id: ownerContact.id })
    .eq('id', company.id);

  // 4. Create additional contacts
  for (const contactData of companyData.contacts) {
    const { error: contactError } = await supabase
      .from('client_contacts')
      .insert({
        client_company_id: company.id,
        full_name: contactData.full_name,
        email: contactData.email,
        phone: contactData.phone,
        title: contactData.title,
        department: contactData.department,
        role: contactData.role,
        is_primary_contact: false,
        can_manage_team: false
      });

    if (contactError) {
      console.error('Error creating contact:', contactError);
    }
  }

  console.log(`✅ Created company ${companyData.company_name} with ${companyData.contacts.length + 1} contacts`);
  return company;
}

async function createProjectWithData(projectData, clientCompanyId, adminUserId) {
  console.log(`Creating project: ${projectData.name}`);

  // Create project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      client_company_id: clientCompanyId
    })
    .select()
    .single();

  if (projectError) {
    console.error('Error creating project:', projectError);
    return null;
  }

  // Add project member (admin user)
  await supabase
    .from('project_members')
    .insert({
      project_id: project.id,
      user_id: adminUserId,
      role: 'lead',
      can_track_time: true,
      can_view_financials: true
    });

  // Create some test time entries
  const timeEntries = [
    {
      project_id: project.id,
      user_id: adminUserId,
      hours_worked: 8.5,
      description: 'TEST_Initial project setup and architecture planning',
      entry_type: 'development',
      is_billable: true,
      hourly_rate: projectData.hourly_rate || 125.00,
      date_worked: '2024-01-20'
    },
    {
      project_id: project.id,
      user_id: adminUserId,
      hours_worked: 6.0,
      description: 'TEST_Client requirements gathering and documentation',
      entry_type: 'consultation',
      is_billable: true,
      hourly_rate: projectData.hourly_rate || 125.00,
      date_worked: '2024-01-22'
    },
    {
      project_id: project.id,
      user_id: adminUserId,
      hours_worked: 4.5,
      description: 'TEST_UI/UX design mockups and wireframes',
      entry_type: 'design',
      is_billable: true,
      hourly_rate: projectData.hourly_rate || 125.00,
      date_worked: '2024-01-25'
    }
  ];

  for (const timeEntry of timeEntries) {
    await supabase.from('time_entries').insert(timeEntry);
  }

  // Create test invoice if project is active
  if (projectData.status === 'active') {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours_worked, 0);
    const subtotal = totalHours * (projectData.hourly_rate || 125.00);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const { data: invoice } = await supabase
      .from('invoices')
      .insert({
        project_id: project.id,
        client_id: null, // Legacy field - using client_company_id in projects instead
        invoice_number: `TEST-INV-${Date.now()}`,
        title: `TEST_Development Services - ${projectData.name}`,
        description: `Professional development services for ${projectData.name} project.`,
        subtotal: subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'sent',
        issue_date: '2024-01-30',
        due_date: '2024-02-29'
      })
      .select()
      .single();

    if (invoice) {
      // Create invoice line items
      await supabase
        .from('invoice_line_items')
        .insert([
          {
            invoice_id: invoice.id,
            description: 'Development Services',
            quantity: totalHours,
            unit_price: projectData.hourly_rate || 125.00,
            total_price: subtotal
          }
        ]);
    }
  }

  // Create project update
  await supabase
    .from('project_updates')
    .insert({
      project_id: project.id,
      author_id: adminUserId,
      title: 'TEST_Project Kickoff',
      content: `TEST_Project ${projectData.name} has been successfully initiated. Initial setup and planning phases are complete. Moving forward with development phase.`,
      update_type: 'milestone',
      visible_to_client: true
    });

  console.log(`✅ Created project ${projectData.name} with time entries and invoice`);
  return project;
}

async function seedTestData() {
  try {
    console.log('🌱 Starting test data seeding...\n');

    // Get admin user ID for project assignments
    const { data: adminUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (!adminUser) {
      console.error('❌ No admin user found. Please ensure an admin user exists before seeding.');
      return;
    }

    console.log('👤 Using admin user ID:', adminUser.id);

    // Create client companies and their contacts
    const createdCompanies = [];
    for (const companyData of testCompanies) {
      const company = await createCompanyWithContacts(companyData);
      if (company) {
        createdCompanies.push(company);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Created ${createdCompanies.length} test companies\n`);

    // Create projects and connect them to companies
    for (let i = 0; i < testProjects.length && i < createdCompanies.length; i++) {
      await createProjectWithData(testProjects[i], createdCompanies[i].id, adminUser.id);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Test data seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${createdCompanies.length} test client companies`);
    console.log(`- ${testCompanies.reduce((sum, c) => sum + c.contacts.length + 1, 0)} test contacts`);
    console.log(`- ${testProjects.length} test projects`);
    console.log('- Multiple time entries per project');
    console.log('- Test invoices for active projects');
    console.log('- Project updates and member assignments');
    console.log('\n🧹 Cleanup: All test data has "TEST_" prefixes for easy identification');

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  }
}

// Cleanup function
async function cleanupTestData() {
  try {
    console.log('🧹 Cleaning up test data...');

    // Get test project IDs first
    const { data: testProjects } = await supabase
      .from('projects')
      .select('id')
      .like('name', 'TEST_%');
    
    const testProjectIds = testProjects?.map(p => p.id) || [];

    // Delete in reverse order of dependencies
    if (testProjectIds.length > 0) {
      await supabase.from('invoice_line_items').delete().in('invoice_id', 
        supabase.from('invoices').select('id').in('project_id', testProjectIds)
      );
      await supabase.from('payments').delete().like('reference_number', 'TEST_%');
      await supabase.from('invoices').delete().in('project_id', testProjectIds);
      await supabase.from('time_entries').delete().in('project_id', testProjectIds);
      await supabase.from('project_updates').delete().in('project_id', testProjectIds);
      await supabase.from('project_members').delete().in('project_id', testProjectIds);
    }
    
    await supabase.from('projects').delete().like('name', 'TEST_%');
    await supabase.from('client_contacts').delete().like('full_name', 'TEST_%');
    await supabase.from('client_companies').delete().like('company_name', 'TEST_%');

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}

// Run based on command line argument
const command = process.argv[2];
if (command === 'cleanup') {
  cleanupTestData();
} else {
  seedTestData();
}

module.exports = { seedTestData, cleanupTestData };