import { Revision } from "@/components/admin/Revision";

interface PageProps {
  params: Promise<{
    postulanteId: string;
    revisionId: string;
  }>;
}

export default async function RevisionPage({ params }: PageProps) {
  const { postulanteId, revisionId } = await params;

  return <Revision revisionId={revisionId} postulanteId={postulanteId} />;
}
