import BalanceCard from '../../components/earnings/BalanceCard';
import LevelProgress from '../../components/earnings/LevelProgress';
import ClickerZone from '../../components/earnings/ClickerZone';

function Earnings() {
  return (
    <div className="h-full w-full flex flex-col gap-2 px-3 py-1.5 overflow-hidden">
      <BalanceCard />
      <LevelProgress />
      <ClickerZone />
    </div>
  );
}

export default Earnings;