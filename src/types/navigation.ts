// Navigation types for Two-Tier system
export interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

export interface NavigationCategory {
  name: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
}

export interface NavigationConfig {
  primary: NavigationCategory[];
  protected?: NavigationItem[];
}

// Navigation configuration
export const navigationConfig: NavigationConfig = {
  primary: [
    {
      name: 'Home',
      href: '/',
      description: 'Welcome to Monkey LoveStack'
    },
    {
      name: 'About',
      href: '/about',
      description: 'Our story and team'
    },
    {
      name: 'Services',
      href: '/services',
      description: 'What we do for our clients',
      children: [
        {
          name: 'Web Development',
          href: '/services/web-development',
          description: 'Modern web applications and sites'
        },
        {
          name: 'Cloud Migration',
          href: '/services/cloud-migration', 
          description: 'Move your apps to the cloud'
        },
        {
          name: 'DevOps & CI/CD',
          href: '/services/devops',
          description: 'Automation and deployment pipelines'
        },
        {
          name: 'App Modernization',
          href: '/services/modernization',
          description: 'Legacy system updates'
        },
        {
          name: 'Consulting',
          href: '/services/consulting',
          description: 'Technology strategy and planning'
        }
      ]
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      description: 'Our work and expertise',
      children: [
        {
          name: 'Case Studies',
          href: '/case-studies',
          description: 'Detailed project showcases'
        },
        {
          name: 'Technologies',
          href: '/technologies',
          description: 'Our tech stack and tools'
        },
        {
          name: 'Success Stories',
          href: '/success-stories',
          description: 'Client testimonials and results'
        },
        {
          name: 'Client Testimonials',
          href: '/testimonials',
          description: 'What our clients say'
        }
      ]
    },
    {
      name: 'Contact',
      href: '/contact',
      description: 'Get in touch with us'
    }
  ],
  protected: [
    {
      name: 'Dashboard',
      href: '/dashboard/projects',
      description: 'Project management dashboard'
    },
    {
      name: 'Users',
      href: '/dashboard/users', 
      description: 'User management (Admin only)'
    },
    {
      name: 'Profile',
      href: '/profile', 
      description: 'Account settings'
    }
  ]
};