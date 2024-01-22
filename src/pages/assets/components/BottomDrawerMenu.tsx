import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, MenuItem, Menu, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';

interface BottomDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomDrawerMenu: React.FC<BottomDrawerMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  
  const toAddWalletMethod = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_ADD_WALLET_METHOD);
  };
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} >
     <DrawerOverlay>
        <DrawerContent>
          <DrawerBody>
            <Menu>
                <MenuItem onClick={toAddWalletMethod}>
                  <Box textAlign="center" w="full" borderRadius="full" bg="blue.500" color="white" p={2}>
                  {t('pages.assets.token.add_wallet')}
                  </Box>
                </MenuItem>
                <MenuItem>
                  <Box textAlign="center" w="full" borderRadius="full" bg="blue.500" color="white" p={2}>
                  {t('pages.assets.token.manage_wallet')}
                  </Box>
                </MenuItem>
            </Menu>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default BottomDrawerMenu;

