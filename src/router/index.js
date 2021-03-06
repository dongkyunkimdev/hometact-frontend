import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: '/',
			component: () => import('@/components/views/Landing'),
		},
		{
			path: '*',
			component: () => import('@/components/views/NotFoundPage'),
		},
		{
			path: '/uploadPost',
			name: '/uploadPost',
			component: () => import('@/components/views/UploadPost'),
			meta: { requiresAuth: true },
		},
		{
			path: '/viewPost',
			name: '/viewPost',
			component: () => import('@/components/views/ViewPost'),
		},
		{
			path: '/myPost',
			component: () => import('@/components/views/MyPost'),
			meta: { requiresAuth: true },
		},
		{
			path: '/myLike',
			component: () => import('@/components/views/MyLike'),
			meta: { requiresAuth: true },
		},
	],
});

router.beforeEach(function (to, from, next) {
	if (
		to.matched.some(function (routeInfo) {
			return routeInfo.meta.requiresAuth;
		})
	) {
		if (router.app.$store.state.accessToken === '') {
			next('/');
			router.app.$toast.error('로그인이 필요한 기능입니다');
		} else {
			next();
		}
	} else {
		next();
	}
});

const originalPush = router.push;
router.push = function push(location) {
	return originalPush.call(this, location).catch(err => err);
};

export default router;
