import DocumentTypeManagement from "@/app/components/admin/document-type-management"
import { getDocumentTypes } from "@/app/admin/actions"

export default async function DocumentTypesPage() {
  const documentTypes = await getDocumentTypes()
  return <DocumentTypeManagement initialDocumentTypes={documentTypes ?? []} />
}
