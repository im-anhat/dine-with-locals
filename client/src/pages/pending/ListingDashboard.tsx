import GuestDetailsCard from '@/components/dashboard/listing/GuestDetailsCard';
import GuestReviewCard from '@/components/dashboard/listing/GuestReviewCard';
import PaymentStatusCard from '@/components/dashboard/listing/PaymentStatusCard';

function ListingDashboard() {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
        Listing Dashboard
      </h1>
      <div className="flex flex-row items-center gap-3 mb-2">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Chicago, IL - July 18: Pho with locals
        </h2>
        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
          Dining
        </span>
      </div>

      <ListingDashboard />
      <GuestDetailsCard />
      <PaymentStatusCard />
      <GuestReviewCard />
    </div>
  );
}

export default ListingDashboard;
