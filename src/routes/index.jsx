import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Pages
import Earnings from '../pages/earnings/Earnings';
import Business from '../pages/business/Business';
import StartBusiness from '../pages/business/StartBusiness';
import BusinessMergers from '../pages/business/BusinessMergers';
import BusinessCategory from '../pages/business/BusinessCategory';
import BusinessSetup from '../pages/business/BusinessSetup';
import BusinessDetail from '../pages/business/BusinessDetail';
import BusinessSettings from '../pages/business/BusinessSettings';
import StaffHiring from '../pages/business/management/StaffHiring';
import VehiclePurchase from '../pages/business/management/VehiclePurchase';
import EquipmentPurchase from '../pages/business/management/EquipmentPurchase';
import InventoryManagement from '../pages/business/management/InventoryManagement';
import ProjectBoard from '../pages/business/management/ProjectBoard';
import BranchManagement from '../pages/business/management/BranchManagement';
import LicensePayment from '../pages/business/management/LicensePayment';
import BizSettings from '../pages/business/management/BizSettings';

// Merger Flow
import MergerConfirm from '../pages/business/merger/MergerConfirm';
import MergerNameInput from '../pages/business/merger/MergerNameInput';
import MergerTrends from '../pages/business/merger/MergerTrends';
import MergerAnalysts from '../pages/business/merger/MergerAnalysts';
import MergerConfigurator from '../pages/business/merger/MergerConfigurator';
import MergerDevelopment from '../pages/business/merger/MergerDevelopment';

import Investing from '../pages/investing/Investing';
import Items from '../pages/items/Items';
import Profile from '../pages/profile/Profile';
import TaxesPage from '../pages/profile/TaxesPage';
import ForbesPage from '../pages/profile/ForbesPage';
import StatisticsPage from '../pages/profile/StatisticsPage';
import CardCollection from '../pages/cards/CardCollection';
import CardDetail from '../pages/cards/CardDetail';
import NotFound from '../pages/NotFound';

// Stocks
import StockPortfolio from '../pages/investing/stocks/StockPortfolio';
import StockMarket from '../pages/investing/stocks/StockMarket';
import StableStocks from '../pages/investing/stocks/StableStocks';
import GrowthStocks from '../pages/investing/stocks/GrowthStocks';
import StockDetail from '../pages/investing/stocks/StockDetail';
import StockBuy from '../pages/investing/stocks/StockBuy';
import StockSell from '../pages/investing/stocks/StockSell';

// Real Estate
import RealEstateMarket from '../pages/investing/realestate/RealEstateMarket';
import RealEstateBuy from '../pages/investing/realestate/RealEstateBuy';
import OwnedProperties from '../pages/investing/realestate/OwnedProperties';
import PropertyDetail from '../pages/investing/realestate/PropertyDetail';

// Crypto
import CryptoExchange from '../pages/investing/crypto/CryptoExchange';
import CryptoDetail from '../pages/investing/crypto/CryptoDetail';
import CryptoBuy from '../pages/investing/crypto/CryptoBuy';
import CryptoSell from '../pages/investing/crypto/CryptoSell';

// Items
import Garage from '../pages/items/Garage';
import CarDetail from '../pages/items/CarDetail';
import CarShowroom from '../pages/items/CarShowroom';
import CarBuy from '../pages/items/CarBuy';
import Hangar from '../pages/items/Hangar';
import AircraftDetail from '../pages/items/AircraftDetail';
import AircraftShop from '../pages/items/AircraftShop';
import AircraftBuy from '../pages/items/AircraftBuy';
import Harbor from '../pages/items/Harbor';
import YachtDetail from '../pages/items/YachtDetail';
import YachtShop from '../pages/items/YachtShop';
import YachtBuy from '../pages/items/YachtBuy';
import CollectionList from '../pages/items/CollectionList';
import InsigniasPage from '../pages/items/Insignias';
import NFTList from '../pages/items/NFTList';
import IslandsPage from '../pages/items/Islands';

function AppRoutes() {
  return (
    <Routes>
      {/* Main tabs with layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Earnings />} />
        <Route path="/earnings" element={<Navigate to="/" replace />} />
        <Route path="/business" element={<Business />} />
        <Route path="/investing" element={<Investing />} />
        <Route path="/items" element={<Items />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Cards */}
      <Route path="/cards" element={<CardCollection />} />
      <Route path="/cards/:cardId" element={<CardDetail />} />

      {/* Profile sub-pages */}
      <Route path="/profile/taxes" element={<TaxesPage />} />
      <Route path="/profile/forbes" element={<ForbesPage />} />
      <Route path="/profile/statistics" element={<StatisticsPage />} />

      {/* Business */}
      <Route path="/business/start" element={<StartBusiness />} />
      <Route path="/business/mergers" element={<BusinessMergers />} />
      <Route path="/business/category/:categoryId" element={<BusinessCategory />} />
      <Route path="/business/setup/:categoryId" element={<BusinessSetup />} />
      <Route path="/business/setup/:categoryId/:subCategoryId" element={<BusinessSetup />} />
      <Route path="/business/detail/:bizId" element={<BusinessDetail />} />
      <Route path="/business/settings/:bizId" element={<BusinessSettings />} />
      <Route path="/business/manage/:bizId/staff" element={<StaffHiring />} />
      <Route path="/business/manage/:bizId/vehicles" element={<VehiclePurchase />} />
      <Route path="/business/manage/:bizId/equipment" element={<EquipmentPurchase />} />
      <Route path="/business/manage/:bizId/inventory" element={<InventoryManagement />} />
      <Route path="/business/manage/:bizId/projects" element={<ProjectBoard />} />
      <Route path="/business/manage/:bizId/branches" element={<BranchManagement />} />
      <Route path="/business/manage/:bizId/licenses" element={<LicensePayment />} />
      <Route path="/business/manage/:bizId/bizsettings" element={<BizSettings />} />

      {/* Merger Flow */}
      <Route path="/business/merger/confirm/:mergerId" element={<MergerConfirm />} />
      <Route path="/business/merger/name/:mergerId" element={<MergerNameInput />} />
      <Route path="/business/merger/trends/:flowId" element={<MergerTrends />} />
      <Route path="/business/merger/analysts/:flowId/:trendId" element={<MergerAnalysts />} />
      <Route path="/business/merger/configurator/:flowId" element={<MergerConfigurator />} />
      <Route path="/business/merger/development/:flowId" element={<MergerDevelopment />} />

      {/* Stocks */}
      <Route path="/investing/stocks/portfolio" element={<StockPortfolio />} />
      <Route path="/investing/stocks/market" element={<StockMarket />} />
      <Route path="/investing/stocks/stable" element={<StableStocks />} />
      <Route path="/investing/stocks/growth" element={<GrowthStocks />} />
      <Route path="/investing/stocks/detail/:stockId" element={<StockDetail />} />
      <Route path="/investing/stocks/buy/:stockId" element={<StockBuy />} />
      <Route path="/investing/stocks/sell/:stockId" element={<StockSell />} />

      {/* Real Estate */}
      <Route path="/investing/realestate/market" element={<RealEstateMarket />} />
      <Route path="/investing/realestate/buy/:propertyId" element={<RealEstateBuy />} />
      <Route path="/investing/realestate/owned" element={<OwnedProperties />} />
      <Route path="/investing/realestate/detail/:propertyId" element={<PropertyDetail />} />

      {/* Crypto */}
      <Route path="/investing/crypto/exchange" element={<CryptoExchange />} />
      <Route path="/investing/crypto/detail/:cryptoId" element={<CryptoDetail />} />
      <Route path="/investing/crypto/buy/:cryptoId" element={<CryptoBuy />} />
      <Route path="/investing/crypto/sell/:cryptoId" element={<CryptoSell />} />

      {/* Items */}
      <Route path="/items/garage" element={<Garage />} />
      <Route path="/items/car/:carId" element={<CarDetail />} />
      <Route path="/items/car-showroom" element={<CarShowroom />} />
      <Route path="/items/car-buy/:carId" element={<CarBuy />} />
      <Route path="/items/hangar" element={<Hangar />} />
      <Route path="/items/aircraft/:aircraftId" element={<AircraftDetail />} />
      <Route path="/items/aircraft-shop" element={<AircraftShop />} />
      <Route path="/items/aircraft-buy/:aircraftId" element={<AircraftBuy />} />
      <Route path="/items/harbor" element={<Harbor />} />
      <Route path="/items/yacht/:yachtId" element={<YachtDetail />} />
      <Route path="/items/yacht-shop" element={<YachtShop />} />
      <Route path="/items/yacht-buy/:yachtId" element={<YachtBuy />} />
      <Route path="/items/collection/:collectionKey" element={<CollectionList />} />
      <Route path="/items/insignias" element={<InsigniasPage />} />
      <Route path="/items/nfts" element={<NFTList />} />
      <Route path="/items/islands" element={<IslandsPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;