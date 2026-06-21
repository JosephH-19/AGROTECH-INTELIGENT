export const resources = {
  en: {
    translation: {
      app: { title: 'AgroTech Inteligente', subtitle: 'Smart Agriculture Platform' },
      nav: {
        home: 'Home', parcels: 'Parcels', crops: 'Crops', climate: 'Climate',
        alerts: 'Alerts', recommendations: 'Recommendations', reports: 'Reports',
        settings: 'Settings', logout: 'Logout', offlineSync: 'Offline Sync'
      },
      auth: {
        login: 'Sign In', register: 'Sign Up', email: 'Email', password: 'Password',
        name: 'Full Name', phone: 'Phone', role: 'Role', loginTitle: 'Welcome Back',
        registerTitle: 'Create Account', noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?', loginError: 'Invalid credentials',
        registerError: 'Registration failed', farmer: 'Farmer', cooperative: 'Cooperative',
        ngo: 'NGO', government: 'Regional Government', admin: 'Administrator'
      },
      home: {
        title: 'Dashboard',
        description: 'Monitor your agricultural plots and receive smart recommendations.',
        totalParcels: 'Parcels', totalCrops: 'Active Crops', activeAlerts: 'Active Alerts',
        synced: 'Synced', lastSync: 'Last sync', viewDetails: 'View details',
        quickActions: 'Quick Actions', newParcel: 'New Parcel', viewClimate: 'View Climate',
        viewAlerts: 'View Alerts'
      },
      parcels: {
        title: 'Parcels', description: 'Manage your agricultural plots.',
        newParcel: 'New Parcel', editParcel: 'Edit Parcel', deleteParcel: 'Delete Parcel',
        name: 'Name', area: 'Area (ha)', location: 'Location', province: 'Province',
        district: 'District', soilType: 'Soil Type', lat: 'Latitude', lng: 'Longitude',
        save: 'Save', cancel: 'Cancel', confirmDelete: 'Delete this parcel?',
        empty: 'No parcels registered yet.',
        soilTypes: { clay: 'Clay', loam: 'Loam', sandy: 'Sandy', silt: 'Silt' },
        health: 'Health Status', good: 'Good', warning: 'Warning', critical: 'Critical'
      },
      crops: {
        title: 'Crops', description: 'Manage your crops and their life cycle.',
        newCrop: 'New Crop', editCrop: 'Edit Crop', deleteCrop: 'Delete Crop',
        type: 'Crop Type', sowingDate: 'Sowing Date', status: 'Status', parcel: 'Parcel',
        save: 'Save', cancel: 'Cancel', confirmDelete: 'Delete this crop?',
        empty: 'No crops registered yet.',
        types: { potato: 'Native Potato', corn: 'Corn', quinoa: 'Quinoa', barley: 'Barley',
          bean: 'Bean', coffee: 'Coffee', maca: 'Maca', oat: 'Oat' },
        statuses: { sowing: 'Sowing', growth: 'Growth', maturation: 'Maturation', harvested: 'Harvested' },
        daysSinceSowing: 'Days since sowing'
      },
      climate: {
        title: 'Climate', description: 'Real-time weather and forecast for your area.',
        current: 'Current Conditions', forecast: '7-Day Forecast', temperature: 'Temperature',
        humidity: 'Humidity', precipitation: 'Precipitation', wind: 'Wind',
        source: 'Data Source', senamhi: 'SENAMHI', nasa: 'NASA POWER',
        feelsLike: 'Feels like', uvIndex: 'UV Index', recommendation: 'Recommendation',
        noData: 'No climate data available.',
        loading: 'Loading climate data...'
      },
      alerts: {
        title: 'Alerts', description: 'Early warnings and notifications.',
        active: 'Active Alerts', history: 'History', markRead: 'Mark as read',
        delete: 'Delete', empty: 'No alerts.', severity: 'Severity',
        types: { frost: 'Frost', plague: 'Plague', drought: 'Drought', heavyRain: 'Heavy Rain',
          disease: 'Disease' },
        severities: { info: 'Info', warning: 'Warning', critical: 'Critical' },
        createdAt: 'Date', read: 'Read'
      },
      recommendations: {
        title: 'Recommendations', description: 'AI-powered agricultural recommendations.',
        apply: 'Apply', reject: 'Reject', applied: 'Applied', rejected: 'Rejected',
        empty: 'No recommendations available.',
        categories: { irrigation: 'Irrigation', plague: 'Plague Control', nutrition: 'Nutrition',
          weed: 'Weed Control', harvest: 'Harvest' },
        source: 'AI Analysis'
      },
      reports: {
        title: 'Reports', description: 'Generate and view agricultural reports.',
        generate: 'Generate Report', period: 'Period', type: 'Report Type',
        download: 'Download', pdf: 'PDF', csv: 'CSV', empty: 'No reports generated yet.',
        types: { climate: 'Climate Report', production: 'Production Report',
          alerts: 'Alerts Report', general: 'General Report' },
        periods: { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' },
        generating: 'Generating report...'
      },
      settings: {
        title: 'Settings', description: 'Configure your preferences.',
        language: 'Language', spanish: 'Spanish', quechua: 'Quechua', english: 'English',
        profile: 'Profile', notifications: 'Notifications', about: 'About',
        cache: 'Clear Cache', sync: 'Synchronize Now',
        fontSize: 'Font Size', small: 'Small', medium: 'Medium', large: 'Large',
        cacheCleared: 'Cache cleared', syncing: 'Synchronizing...'
      },
      offlineSync: {
        title: 'Offline Synchronization',
        description: 'Monitor and sync data when connection is restored.',
        pending: 'Pending changes', syncing: 'Syncing...', lastSync: 'Last sync',
        syncNow: 'Sync now', noPending: 'No pending changes',
        error: 'Sync error', success: 'Sync completed'
      },
      notFound: {
        title: 'Page not found',
        description: 'The page you are looking for does not exist.',
        homeLink: 'Go back to home'
      },
      common: { loading: 'Loading...', error: 'Error', retry: 'Retry', online: 'Online',
        offline: 'Offline', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit' }
    }
  },
  es: {
    translation: {
      app: { title: 'AgroTech Inteligente', subtitle: 'Plataforma Agrícola Inteligente' },
      nav: {
        home: 'Inicio', parcels: 'Parcelas', crops: 'Cultivos', climate: 'Clima',
        alerts: 'Alertas', recommendations: 'Recomendaciones', reports: 'Reportes',
        settings: 'Configuración', logout: 'Cerrar Sesión', offlineSync: 'Sincronización Offline'
      },
      auth: {
        login: 'Iniciar Sesión', register: 'Registrarse', email: 'Correo Electrónico',
        password: 'Contraseña', name: 'Nombre Completo', phone: 'Teléfono', role: 'Rol',
        loginTitle: 'Bienvenido de Nuevo', registerTitle: 'Crear Cuenta',
        noAccount: '¿No tienes cuenta?', hasAccount: '¿Ya tienes cuenta?',
        loginError: 'Credenciales inválidas', registerError: 'Error al registrarse',
        farmer: 'Agricultor', cooperative: 'Cooperativa', ngo: 'ONG',
        government: 'Gobierno Regional', admin: 'Administrador'
      },
      home: {
        title: 'Dashboard',
        description: 'Monitorea tus parcelas agrícolas y recibe recomendaciones inteligentes.',
        totalParcels: 'Parcelas', totalCrops: 'Cultivos Activos', activeAlerts: 'Alertas Activas',
        synced: 'Sincronizado', lastSync: 'Última sincronización', viewDetails: 'Ver detalles',
        quickActions: 'Acciones Rápidas', newParcel: 'Nueva Parcela', viewClimate: 'Ver Clima',
        viewAlerts: 'Ver Alertas'
      },
      parcels: {
        title: 'Parcelas', description: 'Gestiona tus terrenos agrícolas.',
        newParcel: 'Nueva Parcela', editParcel: 'Editar Parcela', deleteParcel: 'Eliminar Parcela',
        name: 'Nombre', area: 'Área (ha)', location: 'Ubicación', province: 'Provincia',
        district: 'Distrito', soilType: 'Tipo de Suelo', lat: 'Latitud', lng: 'Longitud',
        save: 'Guardar', cancel: 'Cancelar', confirmDelete: '¿Eliminar esta parcela?',
        empty: 'No hay parcelas registradas.',
        soilTypes: { clay: 'Arcilloso', loam: 'Franco', sandy: 'Arenoso', silt: 'Limoso' },
        health: 'Estado de Salud', good: 'Bueno', warning: 'Advertencia', critical: 'Crítico'
      },
      crops: {
        title: 'Cultivos', description: 'Gestiona tus cultivos y su ciclo de vida.',
        newCrop: 'Nuevo Cultivo', editCrop: 'Editar Cultivo', deleteCrop: 'Eliminar Cultivo',
        type: 'Tipo de Cultivo', sowingDate: 'Fecha de Siembra', status: 'Estado', parcel: 'Parcela',
        save: 'Guardar', cancel: 'Cancelar', confirmDelete: '¿Eliminar este cultivo?',
        empty: 'No hay cultivos registrados.',
        types: { potato: 'Papa Nativa', corn: 'Maíz', quinoa: 'Quinua', barley: 'Cebada',
          bean: 'Frijol', coffee: 'Café', maca: 'Maca', oat: 'Avena' },
        statuses: { sowing: 'Siembra', growth: 'Crecimiento', maturation: 'Maduración', harvested: 'Cosechado' },
        daysSinceSowing: 'Días desde siembra'
      },
      climate: {
        title: 'Clima', description: 'Clima en tiempo real y pronóstico para tu zona.',
        current: 'Condiciones Actuales', forecast: 'Pronóstico 7 Días', temperature: 'Temperatura',
        humidity: 'Humedad', precipitation: 'Precipitación', wind: 'Viento',
        source: 'Fuente de Datos', senamhi: 'SENAMHI', nasa: 'NASA POWER',
        feelsLike: 'Sensación térmica', uvIndex: 'Índice UV', recommendation: 'Recomendación',
        noData: 'No hay datos climáticos disponibles.',
        loading: 'Cargando datos climáticos...'
      },
      alerts: {
        title: 'Alertas', description: 'Alertas tempranas y notificaciones.',
        active: 'Alertas Activas', history: 'Historial', markRead: 'Marcar como leída',
        delete: 'Eliminar', empty: 'No hay alertas.', severity: 'Severidad',
        types: { frost: 'Helada', plague: 'Plaga', drought: 'Sequía', heavyRain: 'Lluvia Intensa',
          disease: 'Enfermedad' },
        severities: { info: 'Informativo', warning: 'Advertencia', critical: 'Crítico' },
        createdAt: 'Fecha', read: 'Leída'
      },
      recommendations: {
        title: 'Recomendaciones', description: 'Recomendaciones agrícolas con IA.',
        apply: 'Aplicar', reject: 'Rechazar', applied: 'Aplicada', rejected: 'Rechazada',
        empty: 'No hay recomendaciones disponibles.',
        categories: { irrigation: 'Riego', plague: 'Control de Plagas', nutrition: 'Nutrición',
          weed: 'Control de Malezas', harvest: 'Cosecha' },
        source: 'Análisis IA'
      },
      reports: {
        title: 'Reportes', description: 'Genera y consulta reportes agrícolas.',
        generate: 'Generar Reporte', period: 'Período', type: 'Tipo de Reporte',
        download: 'Descargar', pdf: 'PDF', csv: 'CSV', empty: 'No hay reportes generados.',
        types: { climate: 'Reporte Climático', production: 'Reporte de Producción',
          alerts: 'Reporte de Alertas', general: 'Reporte General' },
        periods: { weekly: 'Semanal', monthly: 'Mensual', quarterly: 'Trimestral', yearly: 'Anual' },
        generating: 'Generando reporte...'
      },
      settings: {
        title: 'Configuración', description: 'Configura tus preferencias.',
        language: 'Idioma', spanish: 'Español', quechua: 'Quechua', english: 'Inglés',
        profile: 'Perfil', notifications: 'Notificaciones', about: 'Acerca de',
        cache: 'Limpiar Caché', sync: 'Sincronizar Ahora',
        fontSize: 'Tamaño de Fuente', small: 'Pequeño', medium: 'Mediano', large: 'Grande',
        cacheCleared: 'Caché limpiado', syncing: 'Sincronizando...'
      },
      offlineSync: {
        title: 'Sincronización Offline',
        description: 'Monitorea y sincroniza datos cuando se restablezca la conexión.',
        pending: 'Cambios pendientes', syncing: 'Sincronizando...', lastSync: 'Última sincronización',
        syncNow: 'Sincronizar ahora', noPending: 'Sin cambios pendientes',
        error: 'Error de sincronización', success: 'Sincronización completa'
      },
      notFound: {
        title: 'Página no encontrada',
        description: 'La página que buscas no existe.',
        homeLink: 'Volver al inicio'
      },
      common: { loading: 'Cargando...', error: 'Error', retry: 'Reintentar', online: 'En línea',
        offline: 'Sin conexión', save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar' }
    }
  }
};
