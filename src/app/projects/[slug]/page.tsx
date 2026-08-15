import { ProjectDetailClient } from "@/app/projects/[slug]/project-detail-client";
import { getStaticProjectParams } from "@/lib/static-paths";

export function generateStaticParams() {
  return getStaticProjectParams();
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return <ProjectDetailClient slug={params.slug} />;
}
