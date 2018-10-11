export const homeChildren = [{
    path: '/StrategyList',
    name: 'StrategyList',
    component: resolve => require(['@/components/page/StrategyList'], resolve),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/Welcome',
    name: 'Welcome',
    component: resolve => require(['@/components/common/welcome'], resolve),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/Tipspower',
    name: 'Tipspower',
    component: resolve => require(['@/components/common/Tipspower'], resolve),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/CreateStrategy',
    name: 'CreateStrategy',
    component: resolve => require(['@/components/page/CreateStrategy'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 1
    }
  }, {
    path: '/EditStrategy',
    name: 'EditStrategy',
    component: resolve => require(['@/components/page/EditStrategy'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 1
    }
  }, {
    path: '/LookStrategy',
    name: 'LookStrategy',
    component: resolve => require(['@/components/page/LookStrategy'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 1
    }
  }, {
    path: '/allStrategyList',
    name: 'allStrategyList',
    component: resolve => require(['@/components/page/allStrategyList'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }, {
    path: '/role',
    name: 'role',
    component: resolve => require(['@/components/page/role'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }, {
    path: '/account',
    name: 'account',
    component: resolve => require(['@/components/page/account'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }, {
    path: '/Salesmanagement',
    name: 'Salesmanagement',
    component: resolve => require(['@/components/page/Salesmanagement'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }, {
    path: '/Membermanagement',
    name: 'Membermanagement',
    component: resolve => require(['@/components/page/Membermanagement'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  },
   {
    path: '/ProductConfig',
    name: 'ProductConfig',
    component: resolve => require(['@/components/page/SaleManage/ProductConfig'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }, {
    path: '/ChartList',
    name: 'ChartList',
    component: resolve => require(['@/components/page/SaleManage/ChartList'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  },{
    path: '/CreateProChart',
    name: 'CreateProChart',
    component: resolve => require(['@/components/page/SaleManage/CreateProChart'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  },
  {
    path: '/EditProChart',
    name: 'EditProChart',
    component: resolve => require(['@/components/page/SaleManage/EditProChart'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  },
  {
    path: '/EditStrategyText',
    name: 'EditStrategyText',
    component: resolve => require(['@/components/page/StrategyText/EditStrategyText'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }
  , {
    path: '/SoundManagement',
    name: 'SoundManagement',
    component: resolve => require(['@/components/page/material/SoundManagement'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }
  , {
    path: '/ImageManagement',
    name: 'ImageManagement',
    component: resolve => require(['@/components/page/material/ImageManagement'], resolve),
    meta: {
      requiresAuth: true,
      typeAuth: 0
    }
  }


]

