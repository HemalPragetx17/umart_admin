import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { I18nProvider } from '../umart_admin/i18n/i18nProvider';
import { LayoutProvider, LayoutSplashScreen } from '../umart_admin/layout/core';
import { MasterInit } from '../umart_admin/layout/MasterInit';
import { AuthInit, useAuth } from './modules/auth';
import { useSocket } from './modules/socket/core/Socket';
import NewOrderModal from './modals/new-order-modal';
import sound from './../umart_admin/assets/media/new_order_bell.wav';
const App = () => {
  const [newOrderData, setNewOrderData] = useState<any>([]);
  const { socket } = useSocket();
  const { currentUser } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  // const [audioUnlocked, setAudioUnlocked] = useState(false);
  // useEffect(() => {
  //   const unlockAudio = () => {
  //     if (audioRef.current && !audioUnlocked) {
  //       audioRef.current.muted = false;
  //       audioRef.current.play().catch();
  //       setAudioUnlocked(true);
  //     }
  //     window.removeEventListener('click', unlockAudio);
  //   };
  //   window.addEventListener('click', unlockAudio);
  //   return () => window.removeEventListener('click', unlockAudio);
  // }, [audioUnlocked]);
  useEffect(() => {
    if (socket) {
      const hanldeNewOrder = (data: any) => {
        window.scrollTo(0, 0);
        setNewOrderData((pre: any) => [data.record, ...pre]);
        playSound();
      };
      if (
        currentUser &&
        currentUser?.userType === 2 &&
        currentUser?.roleAndPermission?.roleType === 'R0003'
      ) {
        socket.on('newOrder', hanldeNewOrder);
      }
      return () => {
        socket.off('newOrder', hanldeNewOrder);
      };
    }
  }, [socket, currentUser, audioEnabled]);
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      if (audioRef.current.muted) {
        console.log('muted');
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play notification sound:', error);
        });
      }
    }
  };
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  const handleEnableAudio = () => {
    if (audioRef.current && !audioEnabled) {
      audioRef.current.muted = false;
      // audioRef.current.play().catch(() => {});
      setAudioEnabled(true);
    }
  };
  const handleModalClose = (id: string) => {
    const temp = newOrderData.filter((item: any) => item._id !== id);
    if (temp.length === 0) {
      stopSound();
    }
    setNewOrderData(temp);
  };
  return (
    <>
      {currentUser &&
      currentUser?.userType == 2 &&
      currentUser?.roleAndPermission?.roleType == 'R0003' ? (
        <>
          {' '}
          {newOrderData.length && !!currentUser && (
            <NewOrderModal
              show={newOrderData.length && !!currentUser}
              data={newOrderData}
              onHide={() => {
                stopSound();
                setNewOrderData([]);
              }}
              onClose={handleModalClose}
            />
          )}
          <audio
            ref={audioRef}
            src={sound}
          />
          {!audioEnabled && (
            <div
              onClick={handleEnableAudio}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
                cursor: 'pointer',
                background: 'transparent',
              }}
            />
          )}
        </>
      ) : (
        <></>
      )}
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </>
  );
};
export { App };
