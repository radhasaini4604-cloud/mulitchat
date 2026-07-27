import React, { useState, useEffect, useRef } from 'react'
import './CareersForm.css'

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
}

const OPEN_POSITIONS: JobPosition[] = [
  {
    id: 'role-1',
    title: 'Senior Software Engineer, Agentic Systems',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design and build secure, high-performance sandboxes and code execution environments. Optimize reasoning runtimes and developer tool integrations.'
  },
  {
    id: 'role-2',
    title: 'Software Engineer - Network (C++)',
    department: 'Engineering',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    description: 'Optimize high-performance network stacks, low-latency C++ runtimes, and ML inference communication protocols.'
  },
  {
    id: 'role-3',
    title: 'Member of Technical Staff - Model Training',
    department: 'Research',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    description: 'Train and fine-tune large reasoning models on high-quality codebases and execution environments.'
  },
  {
    id: 'role-4',
    title: 'Network Engineer - ML Infrastructure (High-Speed Interconnects)',
    department: 'Engineering',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    description: 'Architect high-speed optical interconnects and low-latency cluster fabric for large-scale distributed training.'
  },
  {
    id: 'role-5',
    title: 'Exceptional Software Engineer',
    department: 'Engineering',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    description: 'A role for generalist software engineers with high agency, first-principles thinking, and exceptional programming talent.'
  },
  {
    id: 'role-6',
    title: 'AI Research Scientist, Reasoning',
    department: 'Research',
    location: 'Hybrid (Bengaluru)',
    type: 'Full-time',
    description: 'Lead research into reasoning models, code search, execution evaluations, and agent planning protocols.'
  },
  {
    id: 'role-7',
    title: 'Product Designer, Developer Experience',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design visual code canvases, interactive developer tools, and intuitive human-agent collaboration workflows.'
  },
  {
    id: 'role-8',
    title: 'Developer Relations Specialist',
    department: 'DevRel',
    location: 'Remote',
    type: 'Full-time',
    description: 'Engage with developer communities, construct tutorials/demos, and author high-quality documentation.'
  }
]

interface CareersFormProps {
  formRef: React.RefObject<HTMLDivElement | null>
  selectedRoleId?: string
  setSelectedRoleId?: (roleId: string) => void
}

export default function CareersForm({ formRef, selectedRoleId, setSelectedRoleId }: CareersFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: selectedRoleId || 'role-1',
    resumeUrl: '',
    message: ''
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (selectedRoleId) {
      setFormData(prev => ({ ...prev, roleId: selectedRoleId }))
    }
  }, [selectedRoleId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || (!formData.resumeUrl && !resumeFile)) {
      alert('Please fill out Name, Email, and provide either a Resume Link or attach a File.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formInputData = new FormData()
      formInputData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY_HERE')
      formInputData.append('name', formData.name)
      formInputData.append('email', formData.email)
      formInputData.append('subject', `Nothric Application: ${currentRoleObj.title} - ${formData.name}`)
      
      let messageText = `Applied Role: ${currentRoleObj.title}\n`
      if (formData.resumeUrl) {
        messageText += `Resume Link: ${formData.resumeUrl}\n`
      }
      if (formData.message) {
        messageText += `\nMessage: ${formData.message}`
      }
      formInputData.append('message', messageText)

      if (resumeFile) {
        formInputData.append('attachment', resumeFile)
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formInputData
      })

      const result = await response.json()
      if (result.success) {
        setIsSubmitted(true)
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setSubmitError('Failed to submit application. Please check your internet connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, roleId }))
    if (setSelectedRoleId) {
      setSelectedRoleId(roleId)
    }
    setIsDropdownOpen(false)
  }

  const currentRoleObj = OPEN_POSITIONS.find(r => r.id === formData.roleId) || OPEN_POSITIONS[0]

  return (
    <section ref={formRef} className="careers-apply-section reveal-on-scroll" style={{ width: '100%', paddingTop: '20px' }}>
      <div className="roles-centered-header" style={{ marginBottom: '40px' }}>
        <span className="careers-section-label" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>Application</span>
        <h2 className="roles-section-title">Apply Now</h2>
        <p className="roles-section-subtitle">
          Complete the details below to submit your application directly to our core founding team.
        </p>
      </div>

      <div className="careers-form-outer">
        <div className="careers-form-wrapper">
          <div className="careers-form-ray"></div>
          {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="careers-form-grid">
              {/* Name */}
              <div className="input-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Full Name (Required)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address (Required)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Target Position Dropdown */}
              <div className="careers-form-group full-width" ref={dropdownRef}>
                <label className="careers-form-label" htmlFor="roleId">Selected Role</label>
                <div className="careers-dropdown-container">
                  <button
                    type="button"
                    className={`careers-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{OPEN_POSITIONS.find(job => job.id === formData.roleId)?.title || 'Select a role'}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s ease',
                        color: '#888888',
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="careers-dropdown-menu">
                      {OPEN_POSITIONS.map(job => {
                        const isActive = formData.roleId === job.id
                        return (
                          <button
                            key={job.id}
                            type="button"
                            className={`careers-dropdown-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleRoleSelect(job.id)}
                          >
                            {job.title} ({job.location})
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Resume URL */}
              <div className="input-group full-width">
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  placeholder="Resume / Portfolio Link (Optional if attaching file)"
                  disabled={isSubmitting}
                />
              </div>

              {/* File Attachment Field */}
              <div className="input-group full-width file-upload-group">
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="resumeFile"
                    name="resumeFile"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={isSubmitting}
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="resumeFile" className="file-upload-trigger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span>
                      {resumeFile ? `Attached: ${resumeFile.name}` : "Attach Resume / CV file (PDF, Word)"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Intro Message */}
              <div className="input-group full-width">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Introduce Yourself (Optional)"
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="careers-btn-submit" style={{ width: '100%' }} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
            {submitError && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '16px', textAlign: 'center', fontWeight: 600 }}>
                {submitError}
              </p>
            )}
          </form>
        ) : (
          <div className="careers-success-panel">
            <div className="careers-success-icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="careers-success-heading">Application Submitted Successfully</h3>
            <p className="careers-success-text">
              Thanks for applying, {formData.name}! We've received your profile details for the <strong>{currentRoleObj.title}</strong> position. Our team reviews submissions weekly and we will be in touch at <strong>{formData.email}</strong> soon.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setSubmitError(null)
                setFormData({ name: '', email: '', roleId: 'role-1', resumeUrl: '', message: '' })
                setResumeFile(null)
              }}
              className="careers-btn-submit"
              style={{ margin: '0 auto', padding: '12px 24px' }}
            >
              Submit Another Application
            </button>
          </div>
        )}
      </div>
    </div>
    </section>
  )
}
