"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
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

// Helper function to get current user's company_id
async function getCurrentUserCompanyId(): Promise<string | null> {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

  return profile?.company_id || null
}

/* --- CATEGORIES --- */
export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
  return data
}

export async function createCategory(categoryData: any) {
  const supabase = createServerSupabaseClient()
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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("departments").select("*").order("name")
  if (error) {
    console.error("Erro ao buscar departamentos:", error)
    return []
  }
  return data
}

export async function createDepartment(departmentData: any) {
  const supabase = createServerSupabaseClient()
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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("document_types").select("*").order("name")
  if (error) {
    console.error("Erro ao buscar tipos de documento:", error)
    return []
  }
  return data
}

export async function createDocumentType(documentTypeData: any) {
  const supabase = createServerSupabaseClient()
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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("profiles").select("*").order("full_name")

  if (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
  return data
}

export async function updateUser(id: string, userData: any) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
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
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("profiles").update({ status: "inactive" }).eq("id", id)

  if (error) {
    console.error("Erro ao desativar usuário:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}

/* --- WORKFLOWS --- */
export async function getWorkflows(): Promise<Workflow[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("approval_workflows").select("*").order("name")

  if (error) {
    console.error("Erro ao buscar workflows:", error)
    return []
  }
  return data
}

export async function createWorkflow(workflowData: any) {
  const supabase = createServerSupabaseClient()
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
  const supabase = createServerSupabaseClient()

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
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("approval_workflows").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar workflow:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin")
  return { success: true }
}
