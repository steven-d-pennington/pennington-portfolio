'use client'

import { useState, useEffect } from 'react'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { InlineLoading } from '@/components/LoadingSpinner'
import FormField, { SelectField } from '@/components/FormField'
import { useToast } from '@/components/ToastProvider'

interface ClientCompany {
  id: string
  company_name: string
  status: string
  primary_contact?: {
    full_name: string
    email: string
  } | null
}

interface InviteClientModalProps {
  isOpen: boolean
  onClose: () => void
  onInviteSuccess?: () => void
}

export default function InviteClientModal({ isOpen, onClose, onInviteSuccess }: InviteClientModalProps) {
  const { showSuccess } = useToast()
  const [companies, setCompanies] = useState<ClientCompany[]>([])
  
  const { loading: loadingCompanies, execute: loadCompanies } = useAsyncOperation<ClientCompany[]>()
  const { loading: submitting, execute: submitInvitation } = useAsyncOperation({
    onSuccess: () => {
      showSuccess('Invitation sent successfully!')
      resetForm()
      onInviteSuccess?.()
      onClose()
    }
  })
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    title: '',
    department: '',
    role: 'member' as 'owner' | 'tech' | 'media' | 'finance' | 'member',
    client_company_id: '',
    is_primary_contact: false,
    is_billing_contact: false,
    can_manage_team: false
  })

  // Load companies when modal opens
  useEffect(() => {
    if (isOpen && !loadingCompanies && companies.length === 0) {
      loadCompanies(async () => {
        const response = await fetch('/api/client-companies')
        if (!response.ok) {
          throw new Error('Failed to fetch client companies')
        }
        const data = await response.json()
        const companiesList = data.companies || []
        setCompanies(companiesList)
        return companiesList
      })
    }
  }, [isOpen, loadingCompanies, companies.length, loadCompanies])

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      title: '',
      department: '',
      role: 'member',
      client_company_id: '',
      is_primary_contact: false,
      is_billing_contact: false,
      can_manage_team: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await submitInvitation(async () => {
      const response = await fetch('/api/invitations/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      return data
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invite Client Contact
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={submitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Company *
            </label>
            <select
              required
              value={formData.client_company_id}
              onChange={(e) => setFormData({ ...formData, client_company_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={loadingCompanies}
            >
              <option value="">Select a client company...</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name} {company.primary_contact && `(${company.primary_contact.full_name})`}
                </option>
              ))}
            </select>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter job title"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter department"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="member">Member</option>
                <option value="owner">Owner</option>
                <option value="tech">Technical Lead</option>
                <option value="media">Media Manager</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permissions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_primary_contact}
                  onChange={(e) => setFormData({ ...formData, is_primary_contact: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Primary Contact</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_billing_contact}
                  onChange={(e) => setFormData({ ...formData, is_billing_contact: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Billing Contact</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.can_manage_team}
                  onChange={(e) => setFormData({ ...formData, can_manage_team: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Can Manage Team</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting && <InlineLoading />}
              {submitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}