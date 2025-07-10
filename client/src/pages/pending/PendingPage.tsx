import HostSidePending from '../../components/pending/HostSidePending';
import GuestSidePending from '../../components/pending/GuestSidePending';
import { useUser } from '@/contexts/UserContext';
import { PendingMappingProvider } from '../../contexts/PendingMappingContext';

function PendingPage() {
  const { currentUser } = useUser();
  return (
    <>
      {currentUser?.role == 'Host' ? (
        <div>
          <PendingMappingProvider>
            <HostSidePending />
          </PendingMappingProvider>
        </div>
      ) : (
        <GuestSidePending />
      )}
    </>
  );
}

export default PendingPage;
