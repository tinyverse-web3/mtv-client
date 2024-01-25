import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, MenuItem, Menu, Box, Flex, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import IconEdit from "@/assets/images/wallet/icon-white-edit.png";
import IconExport from '@/assets/images/wallet/icon-white-export.png';
import IconAddressType from '@/assets/images/wallet/icon-white-address-type.png';

interface WalletDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEditWalletName: () => void;
}

const WalletDrawerMenu: React.FC<WalletDrawerMenuProps> = ({ isOpen, onClose, onEditWalletName }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} >
     <DrawerOverlay>
        <DrawerContent>
          <DrawerBody>
            <Menu>
                <MenuItem onClick={onEditWalletName}>
                    <Box className='items-center ml-2 bg-blue-500 text-white w-full rounded-full p-2'>
                      <Flex className='justify-center'>
                        <img src={IconEdit} className="w-6 h-6 mr-2" />
                        {t('pages.assets.token.edit_wallet_name')}
                      </Flex>
                    </Box>
                </MenuItem>
                <MenuItem>
                    <Box className='items-center ml-2 bg-blue-500 text-white w-full rounded-full p-2'>
                      <Flex className='justify-center'>
                        <img src={IconAddressType} className="w-6 h-6 mr-2" />
                        {t('pages.assets.token.wallet_select_addr_type')}
                      </Flex>
                    </Box>
                </MenuItem>
                <MenuItem>
                    <Box className='items-center ml-2 bg-blue-500 text-white w-full rounded-full p-2'>
                      <Flex className='justify-center'>
                        <img src={IconExport} className="w-6 h-6 mr-2" />
                        {t('pages.assets.token.export_wallet')}
                      </Flex>
                    </Box>
                </MenuItem>
            </Menu>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default WalletDrawerMenu;

