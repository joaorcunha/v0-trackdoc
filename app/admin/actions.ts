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
    console.log("[v0] getCurrentUserCompanyId: Nenhum usuário autenticado")
    return null
  }

  console.log("[v0] getCurrentUserCompanyId: Usuário autenticado:", user.id)

  const adminClient = createAdminClient()
  const { data: profile, error } = await adminClient.from("profiles").select("company_id").eq("id", user.id).single()

  if (error) {
    console.error("[v0] getCurrentUserCompanyId: Erro ao buscar profile:", error)
    return null
  }

  if (!profile) {
    console.error("[v0] getCurrentUserCompanyId: Profile não encontrado para usuário:", user.id)
    return null
  }

  console.log("[v0] getCurrentUserCompanyId: company_id encontrado:", profile.company_id)
  return profile.company_id
}

/* --- CATEGORIES --- */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) {
    console.error("Erro ao buscar categorias:", error)
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
    console.error("Erro ao criar categoria:", error)
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
    console.error("Erro ao atualizar categoria:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteCategory(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar categoria:", error)
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
    console.error("Erro ao buscar departamentos:", error)
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
    console.error("Erro ao criar departamento:", error)
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
    console.error("Erro ao atualizar departamento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteDepartment(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("departments").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar departamento:", error)
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
    console.error("Erro ao buscar tipos de documento:", error)
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
    console.error("Erro ao criar tipo de documento:", error)
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
    console.error("Erro ao atualizar tipo de documento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true, data: data[0] }
}

export async function deleteDocumentType(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("document_types").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar tipo de documento:", error)
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
    console.error("Erro ao buscar usuários: Usuário não autenticado")
    return []
  }

  const { data, error } = await adminClient.from("profiles").select("*").eq("company_id", companyId).order("full_name")

  if (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
  return data
}

export async function getCurrentUser() {
  console.log("[v0] getCurrentUser: Iniciando busca do usuário atual")
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("[v0] getCurrentUser: Nenhum usuário autenticado")
    return null
  }

  console.log("[v0] getCurrentUser: Usuário autenticado encontrado:", user.id, user.email)

  const adminClient = createAdminClient()
  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("id, email, full_name, role, company_id")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("[v0] getCurrentUser: Erro ao buscar perfil do usuário:", error)
    return null
  }

  console.log("[v0] getCurrentUser: Perfil encontrado:", profile)
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
    console.error("Erro ao atualizar usuário:", error)
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
    console.error("Erro ao desativar usuário:", error)
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
    console.error("Erro ao buscar workflows:", error)
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
    console.error("Erro ao criar workflow:", error)
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
    console.error("Erro ao atualizar workflow:", error)
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
    console.error("Erro ao deletar notificação:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}
