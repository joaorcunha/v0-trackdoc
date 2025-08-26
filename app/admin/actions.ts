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
}

interface Department {
  id: number
  name: string
  short_name: string // Corrigido para snake_case
  status: "active" | "inactive"
}

interface DocumentType {
  id: number
  name: string
  description: string | null
  prefix: string
  color: string
  requiredFields: string[]
  approvalRequired: boolean
  retentionPeriod: number
  status: "active" | "inactive"
  template: string | null
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

export async function createCategory(categoryData: Omit<Category, "id">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc("create_category", {
    p_name: categoryData.name,
    p_description: categoryData.description,
    p_color: categoryData.color,
    p_status: categoryData.status,
  })
  if (error) {
    console.error("Erro ao criar categoria:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/categories")
  return { success: true, data }
}

export async function updateCategory(id: number, categoryData: Partial<Category>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc("update_category", {
    p_id: id,
    p_name: categoryData.name,
    p_description: categoryData.description,
    p_color: categoryData.color,
    p_status: categoryData.status,
  })
  if (error) {
    console.error("Erro ao atualizar categoria:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/categories")
  return { success: true, data }
}

export async function deleteCategory(id: number) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.rpc("delete_category", { p_id: id })
  if (error) {
    console.error("Erro ao deletar categoria:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/categories")
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

export async function createDepartment(departmentData: Omit<Department, "id">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc("create_department", {
    p_name: departmentData.name,
    p_short_name: departmentData.short_name,
    p_status: departmentData.status,
  })
  if (error) {
    console.error("Erro ao criar departamento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/departments")
  return { success: true, data }
}

export async function updateDepartment(id: number, departmentData: Partial<Department>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc("update_department", {
    p_id: id,
    p_name: departmentData.name,
    p_short_name: departmentData.short_name,
    p_status: departmentData.status,
  })
  if (error) {
    console.error("Erro ao atualizar departamento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/departments")
  return { success: true, data }
}

export async function deleteDepartment(id: number) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.rpc("delete_department", { p_id: id })
  if (error) {
    console.error("Erro ao deletar departamento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/departments")
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

export async function createDocumentType(documentTypeData: Omit<DocumentType, "id">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc("create_document_type", {
    p_name: documentTypeData.name,
    p_description: documentTypeData.description,
    p_prefix: documentTypeData.prefix,
    p_color: documentTypeData.color,
    p_required_fields: documentTypeData.requiredFields,
    p_approval_required: documentTypeData.approvalRequired,
    p_retention_period: documentTypeData.retentionPeriod,
    p_status: documentTypeData.status,
    p_template: documentTypeData.template,
  })
  if (error) {
    console.error("Erro ao criar tipo de documento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/document-types")
  return { success: true, data }
}

export async function updateDocumentType(id: number, documentTypeData: Partial<DocumentType>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc("update_document_type", {
    p_id: id,
    p_name: documentTypeData.name,
    p_description: documentTypeData.description,
    p_prefix: documentTypeData.prefix,
    p_color: documentTypeData.color,
    p_required_fields: documentTypeData.requiredFields,
    p_approval_required: documentTypeData.approvalRequired,
    p_retention_period: documentTypeData.retentionPeriod,
    p_status: documentTypeData.status,
    p_template: documentTypeData.template,
  })
  if (error) {
    console.error("Erro ao atualizar tipo de documento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/document-types")
  return { success: true, data }
}

export async function deleteDocumentType(id: number) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.rpc("delete_document_type", { p_id: id })
  if (error) {
    console.error("Erro ao deletar tipo de documento:", error)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/document-types")
  return { success: true }
}
