/**
 * Use in page components:
    definePageMeta({
      middleware: 'authenticated',
    });
 */
export default defineNuxtRouteMiddleware(_to => {
  const route = useRoute();
  const user = useUserStore();

  if (process?.server) {
    return;
  }

  if (!user.loggedIn && route.name !== 'poaps-slug-reserve-mint') {
    return navigateTo('/');
  }
});
