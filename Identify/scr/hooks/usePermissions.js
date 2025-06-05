import { useEffect, useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';

const usePermissions = (permissionType) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);
      
      let permissionResult;
      
      switch (permissionType) {
        case 'camera':
          permissionResult = await Camera.requestCameraPermissionsAsync();
          break;
        case 'mediaLibrary':
          permissionResult = await MediaLibrary.requestPermissionsAsync();
          break;
        default:
          console.warn(`Tipo de permissão não suportado: ${permissionType}`);
          setStatus('undetermined');
          return;
      }

      setStatus(permissionResult.status);
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setStatus('undetermined');
    } finally {
      setLoading(false);
    }
  }, [permissionType]);

  useEffect(() => {
    if (permissionType) {
      requestPermission();
    }
  }, [requestPermission, permissionType]);

  return { status, loading, requestPermission };
};

export default usePermissions;