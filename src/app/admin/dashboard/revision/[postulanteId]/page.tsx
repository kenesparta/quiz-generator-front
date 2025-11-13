import { Revision } from "@/components/admin/Revision";

interface PageProps {
  params: Promise<{
    postulanteId: string;
  }>;
}

export default async function RevisionPage({ params }: PageProps) {
  const { postulanteId } = await params;

  return <Revision postulanteId={postulanteId} />;
}
