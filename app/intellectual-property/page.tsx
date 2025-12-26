import LegalPageContent from '@/components/LegalPageContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Intellectual Property — House of Weaves',
}

export default function IntellectualPropertyPage() {
  return <LegalPageContent templateId="intellectual-property" />
}
