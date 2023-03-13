// import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export default function ChatImChare() {
  
  const [ params ] = useSearchParams(); // const { pk } = useParams();
  const pk = params?.get("pk");
  return (
    <div >
      {pk}

    </div>
  )
}
