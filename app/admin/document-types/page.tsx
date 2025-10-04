import DocumentTypeManagement from "@/app/components/admin/document-type-management"
import { getDocumentTypes } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export default async function DocumentTypesPage() {
  const documentTypes = await getDocumentTypes()
  return <DocumentTypeManagement initialDocumentTypes={documentTypes ?? []} />
}
