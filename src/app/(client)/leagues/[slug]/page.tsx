import LeagueDetail from "@/components/league/detail";
import LeagueSelector from "@/components/league/selector";

export default async function LeaguePage({ params }: { params: { slug: string } }) {
  return (
    <div className="relative">
      <LeagueDetail slug={params.slug} />
      <div className="absolute top-4 right-4 w-28 sm:w-36 md:w-44 lg:w-52">
        {/* <label htmlFor="league-selector" className="block text-sm font-medium text-gray-700 mb-1">
          Select League
        </label> */}
        <div className="group relative">
          <LeagueSelector currentSlug={params.slug} />
        </div>
      </div>
    </div>
  );
}
