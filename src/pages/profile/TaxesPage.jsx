import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { calculateTax, getTaxBracket } from '../../data/taxData';
import { formatCurrency } from '../../utils/formatCurrency';
import PageHeader from '../../components/common/PageHeader';
import AdSpace from '../../components/common/AdSpace';

function TaxesPage() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { incomePerHour } = useGame();

  const taxPerHour = calculateTax(incomePerHour);
  const bracket = getTaxBracket(incomePerHour);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <PageHeader title="Taxes" backTo="/profile" />
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Tax Rate</p>
          <p className={`text-2xl font-black text-red-400`}>{(bracket.rate * 100).toFixed(0)}%</p>
        </div>
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Tax Deducted Per Hour</p>
          <p className={`text-xl font-black text-red-400`}>-{formatCurrency(taxPerHour)}</p>
          <p className={`text-[10px] mt-1 ${t.text.tertiary}`}>
            Auto-deducted from business income
          </p>
        </div>
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-sm font-bold mb-2 ${t.text.primary}`}>How Taxes Work</p>
          <p className={`text-xs ${t.text.secondary}`}>
            Taxes are automatically deducted from your business income based on your
            total income bracket. Higher income = higher tax rate.
          </p>
        </div>
      </div>
      <AdSpace />
    </div>
  );
}

export default TaxesPage;