"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// Tipos para as entidades
interface Category {
  id: number
  name: string
  description: string
  color: string
  status: "active" | "inactive"
  company_id: string
}

interface Department {
  id: number
  name: string
  short_name: string // Corrigido para snake_case
  status: "active" | "inactive"
  company_id: string
}

interface DocumentType {
  id: number
  name: string
  description: string | null
  prefix: string
  color: string
  required_fields: string[]
  approval_required: boolean
  retention_period: number
  status: "active" | "inactive"
  template_content: string | null
  company_id: string
}

interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "manager" | "user"
  department_id: number | null
  status: "active" | "inactive"
  created_at: string
  company_id: string
}

interface Workflow {
  id: number
  name: string
  description: string
  document_types: number | null
  steps: any[]
  status: "active" | "inactive"
  created_at: string
  company_id: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  user_id: string
  company_id: string
  entity_type: string | null
  entity_id: string | null
  created_at: string
  read: boolean
}

// Helper function to get current user's company_id
async function getCurrentUserCompanyId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const adminClient = createAdminClient()
  const { data: profile, error } = await adminClient.from("profiles").select("company_id").eq("id", user.id).single()

  if (error || !profile) {
    return null
  }

  return profile.company_id
}

/* --- CATEGORIES --- */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) {
    return []
  }
  return data
}

export async function createCategory(categoryData: any) {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: categoryData.name,
      description: categoryData.description,
      color: categoryData.color,
      status: categoryData.status,
      company_id: companyId,
    })
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function updateCategory(id: string, categoryData: any) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: categoryData.name,
      description: categoryData.description,
      color: categoryData.color,
      status: categoryData.status,
    })
    .eq("id", id)
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteCategory(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- DEPARTMENTS --- */
export async function getDepartments(): Promise<Department[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("departments").select("*").order("name")
  if (error) {
    return []
  }
  return data
}

export async function createDepartment(departmentData: any) {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { data, error } = await supabase
    .from("departments")
    .insert({
      name: departmentData.name,
      short_name: departmentData.short_name,
      description: departmentData.description,
      color: departmentData.color,
      status: departmentData.status,
      company_id: companyId,
    })
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function updateDepartment(id: string, departmentData: any) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("departments")
    .update({
      name: departmentData.name,
      short_name: departmentData.short_name,
      description: departmentData.description,
      color: departmentData.color,
      status: departmentData.status,
    })
    .eq("id", id)
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteDepartment(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("departments").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- DOCUMENT TYPES --- */
export async function getDocumentTypes(): Promise<DocumentType[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("document_types").select("*").order("name")
  if (error) {
    return []
  }
  return data
}

export async function createDocumentType(documentTypeData: any) {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { data, error } = await supabase
    .from("document_types")
    .insert({
      name: documentTypeData.name,
      description: documentTypeData.description,
      prefix: documentTypeData.prefix,
      color: documentTypeData.color,
      required_fields: documentTypeData.requiredFields,
      approval_required: documentTypeData.approvalRequired,
      retention_period: documentTypeData.retentionPeriod,
      status: documentTypeData.status,
      template_content: documentTypeData.template,
      company_id: companyId,
    })
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function updateDocumentType(id: string, documentTypeData: any) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("document_types")
    .update({
      name: documentTypeData.name,
      description: documentTypeData.description,
      prefix: documentTypeData.prefix,
      color: documentTypeData.color,
      required_fields: documentTypeData.requiredFields,
      approval_required: documentTypeData.approvalRequired,
      retention_period: documentTypeData.retentionPeriod,
      status: documentTypeData.status,
      template_content: documentTypeData.template,
    })
    .eq("id", id)
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteDocumentType(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("document_types").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- USERS --- */
export async function getUsers(): Promise<User[]> {
  const adminClient = createAdminClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return []
  }

  const { data, error } = await adminClient.from("profiles").select("*").eq("company_id", companyId).order("full_name")

  if (error) {
    return []
  }
  return data
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const adminClient = createAdminClient()
  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("id, email, full_name, role, company_id")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

export async function updateUser(id: string, userData: any) {
  const adminClient = createAdminClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { data: existingUser } = await adminClient.from("profiles").select("company_id").eq("id", id).single()

  if (!existingUser || existingUser.company_id !== companyId) {
    return { success: false, error: "Usuário não encontrado ou sem permissão" }
  }

  const { data, error } = await adminClient
    .from("profiles")
    .update({
      full_name: userData.full_name,
      role: userData.role,
      department_id: userData.department_id,
      status: userData.status,
    })
    .eq("id", id)
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteUser(id: string) {
  const adminClient = createAdminClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { data: existingUser } = await adminClient.from("profiles").select("company_id").eq("id", id).single()

  if (!existingUser || existingUser.company_id !== companyId) {
    return { success: false, error: "Usuário não encontrado ou sem permissão" }
  }

  const { error } = await adminClient.from("profiles").update({ status: "inactive" }).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- WORKFLOWS --- */
export async function getWorkflows(): Promise<Workflow[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("approval_workflows").select("*").order("name")

  if (error) {
    return []
  }
  return data
}

export async function createWorkflow(workflowData: any) {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { data, error } = await supabase
    .from("approval_workflows")
    .insert({
      name: workflowData.name,
      description: workflowData.description,
      document_types: workflowData.document_types,
      steps: workflowData.steps,
      status: workflowData.status,
      company_id: companyId,
    })
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function updateWorkflow(id: string, workflowData: any) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("approval_workflows")
    .update({
      name: workflowData.name,
      description: workflowData.description,
      document_types: workflowData.document_types,
      steps: workflowData.steps,
      status: workflowData.status,
    })
    .eq("id", id)
    .select()

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteWorkflow(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("approval_workflows").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar workflow:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- NOTIFICATIONS --- */
export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    console.error("Erro ao buscar notificações: Usuário não autenticado")
    return []
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar notificações:", error)
    return []
  }
  return data || []
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id).eq("company_id", companyId)

  if (error) {
    console.error("Erro ao marcar notificação como lida:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteNotification(id: string) {
  const supabase = await createServerSupabaseClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) {
    return { success: false, error: "Usuário não autenticado" }
  }

  const { error } = await supabase.from("notifications").delete().eq("id", id).eq("company_id", companyId)

  if (error) {
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- DOCUMENTS --- */
export async function getDocuments() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      document_number,
      version,
      status,
      file_type,
      file_name,
      created_at,
      updated_at,
      department:departments(name, short_name),
      document_type:document_types(name, prefix),
      author:profiles(full_name)
    `)
    .order("updated_at", { ascending: false })
  
  if (error) {
    return []
  }
  return data || []
}

export async function getDocumentById(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      department:departments(name, short_name),
      document_type:document_types(name, prefix),
      author:profiles(full_name, email),
      category:categories(name, color)
    `)
    .eq("id", id)
    .single()
  
  if (error) {
    return null
  }
  return data
}

/* --- AUDIT LOGS --- */
export async function getAuditLogs(limit = 100) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      entity_type,
      entity_id,
      details,
      ip_address,
      user_agent,
      created_at,
      user:profiles(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)
  
  if (error) {
    return []
  }
  return data || []
}

/* --- DASHBOARD STATS --- */
export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()
  
  // Buscar contagens
  const [documentsResult, pendingResult, usersResult, departmentsResult] = await Promise.all([
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("documents").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("departments").select("id", { count: "exact", head: true }).eq("status", "active"),
  ])
  
  return {
    totalDocuments: documentsResult.count || 0,
    pendingDocuments: pendingResult.count || 0,
    totalUsers: usersResult.count || 0,
    totalDepartments: departmentsResult.count || 0,
  }
}

export async function getDocumentsByStatus() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("documents")
    .select("status")
  
  if (error || !data) {
    return { approved: 0, pending: 0, draft: 0, rejected: 0 }
  }
  
  const counts = data.reduce((acc: any, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1
    return acc
  }, {})
  
  return {
    approved: counts.approved || 0,
    pending: counts.pending || 0,
    draft: counts.draft || 0,
    rejected: counts.rejected || 0,
  }
}

export async function getDocumentsByDepartment() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("documents")
    .select(`
      department:departments(name, short_name)
    `)
  
  if (error || !data) {
    return []
  }
  
  const counts: Record<string, number> = {}
  data.forEach((doc: any) => {
    if (doc.department) {
      const name = doc.department.short_name || doc.department.name
      counts[name] = (counts[name] || 0) + 1
    }
  })
  
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}

export async function getRecentActivity(limit = 10) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      entity_type,
      details,
      created_at,
      user:profiles(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)
  
  if (error) {
    return []
  }
  return data || []
}

/* --- APPROVAL FLOW --- */
export async function getDocumentApprovalFlow(documentId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("document_approvals")
    .select(`
      id,
      status,
      comment,
      approved_at,
      approver:profiles(full_name, email)
    `)
    .eq("document_id", documentId)
    .order("order_index")
  
  if (error) {
    return []
  }
  return data || []
}

export async function getDocumentAuditLog(documentId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      details,
      created_at,
      ip_address,
      user:profiles(full_name)
    `)
    .eq("entity_type", "document")
    .eq("entity_id", documentId)
    .order("created_at", { ascending: false })
  
  if (error) {
    return []
  }
  return data || []
}
