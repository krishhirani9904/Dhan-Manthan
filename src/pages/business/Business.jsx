import BusinessHeader from '../../components/business/BusinessHeader';
import IncomeCard from '../../components/business/IncomeCard';
import BusinessActions from '../../components/business/BusinessActions';
import OwnedBusinessList from '../../components/business/OwnedBusinessList';

function Business() {
  return (
    <div className="h-full w-full flex flex-col gap-2.5 px-3 py-2 overflow-hidden">
      <BusinessHeader />
      <IncomeCard />
      <BusinessActions />
      <OwnedBusinessList />
    </div>
  );
}

export default Business;