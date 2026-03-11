import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { formatNumber } from '../../utils/formatCurrency';
import { PROPERTIES } from '../../data/realEstate';
import { COLLECTIONS, COLLECTION_KEYS } from '../../data/collectionsData';
import { NFTS } from '../../data/nftsData';
import { ISLANDS } from '../../data/islandsData';
import PageHeader from '../../components/common/PageHeader';
import AdSpace from '../../components/common/AdSpace';

function StatisticsPage() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const {
    totalClicks, ownedBusinesses, mergedBusinesses, ownedProperties,
    ownedCars, ownedAircraft, ownedYachts, ownedCollections,
    ownedIslands, ownedNFTs, ownedStocks, ownedCrypto,
  } = useGame();

  const totalCollections = Object.values(ownedCollections || {}).reduce((s, arr) => s + arr.length, 0);
  const maxCollections = COLLECTION_KEYS.reduce((s, key) => s + (COLLECTIONS[key]?.total || 0), 0);

  const stats = [
    { label: 'Total Clicks', value: formatNumber(totalClicks) },
    { label: 'Businesses', value: `${(ownedBusinesses || []).length}` },
    { label: 'Merged Companies', value: `${(mergedBusinesses || []).length}` },
    { label: 'Real Estate', value: `${(ownedProperties || []).length} of ${PROPERTIES.length}` },
    { label: 'Cars', value: `${(ownedCars || []).length}` },
    { label: 'Aircraft', value: `${(ownedAircraft || []).length}` },
    { label: 'Yachts', value: `${(ownedYachts || []).length}` },
    { label: 'Collections', value: `${totalCollections} of ${maxCollections}` },
    { label: 'Islands', value: `${(ownedIslands || []).length} of ${ISLANDS.length}` },
    { label: 'NFTs', value: `${(ownedNFTs || []).length} of ${NFTS.length}` },
    { label: 'Stocks Held', value: `${(ownedStocks || []).length}` },
    { label: 'Crypto Held', value: `${(ownedCrypto || []).length}` },
  ];

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <PageHeader title="Statistics" backTo="/profile" />
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {stats.map(stat => (
          <div key={stat.label}
            className={`flex items-center justify-between px-4 py-3 rounded-xl
              ${t.bg.card} border ${t.border.default}`}>
            <span className={`text-xs ${t.text.secondary}`}>{stat.label}</span>
            <span className={`text-sm font-bold ${t.text.primary}`}>{stat.value}</span>
          </div>
        ))}
      </div>
      <AdSpace />
    </div>
  );
}

export default StatisticsPage;