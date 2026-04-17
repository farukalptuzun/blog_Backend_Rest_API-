import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Eski /blog/category/... adresleri etiket sayfasına yönlendirilir */
export default async function CategoryToTagRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/blog/tag/${encodeURIComponent(slug)}`);
}
