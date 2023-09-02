// import { useParams } from 'react-router-dom';
import { useGlobalStore, useChatStore } from '@/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
const NOSTR_KEY = 'nostr_sk';

export default function ChatImChare() {
  const {  nostr } = useGlobalStore((state) => state);
  const [params] = useSearchParams(); // const { pk } = useParams();
  const nav = useNavigate();
  const toSharePk = params?.get('pk');
  return <div></div>;
}
