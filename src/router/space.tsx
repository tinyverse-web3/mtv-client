import { RouteObject } from 'react-router-dom';
import SpaceIndex from '@/pages/space';
import SpaceAuthenticator from '@/pages/space/authenticator';
import SpaceAuthenticatorAdd from '@/pages/space/authenticator/add';
import NoteEdit from '@/pages/space/note/edit';
import Note from '@/pages/space/note/list';
export const ROUTE_PATH_SPACE = {
  NOTE: '/space/note',
  NOTE_EDIT: '/space/note/:id',
  SPACE_INDEX: '/space',
  SPACE_AUTHENTICATOR: '/space/authenticator',
  SPACE_AUTHENTICATOR_ADD: '/space/authenticator/add',
};

export const spaceRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_SPACE.NOTE,
    element: <Note />,
  },
  {
    path: ROUTE_PATH_SPACE.NOTE_EDIT,
    element: <NoteEdit />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_INDEX,
    element: <SpaceIndex />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_AUTHENTICATOR,
    element: <SpaceAuthenticator />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_AUTHENTICATOR_ADD,
    element: <SpaceAuthenticatorAdd />,
  },
];
