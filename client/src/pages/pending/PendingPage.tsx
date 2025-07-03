import HostSidePending from '../../components/pending/HostSidePending';
import GuestSidePending from '../../components/pending/GuestSidePending';
import { useUser } from '@/contexts/UserContext';
function PendingPage() {
  const { currentUser } = useUser();
  return (
    <>
      {currentUser?.role == 'Host' ? <HostSidePending /> : <GuestSidePending />}
    </>
  );
}

export default PendingPage;
