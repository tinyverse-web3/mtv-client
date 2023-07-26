// import { useParams } from 'react-router-dom';
import { useRequest } from '@/api';
import { ROUTE_PATH } from '@/router/index';
import { useGlobalStore, useChatStore } from '@/store';
import { useEffect } from 'react';
import { getPublicKey } from 'nostr-tools';
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
