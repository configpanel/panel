<script lang="ts">
	import { Navigation } from '@configpanel/panel';
	import '../app.scss';
	let { children } = $props();
</script>

<Navigation nav={[
	{ title: 'Dashboard', icon: 'House', items: [{ title: '', url: '/' }] },
	{
		title: 'User Management',
		icon: 'Users',
		items: [
			{ title: 'Users', url: '/users', icon: 'Users' },
			{ title: 'Ban list', url: '/users/banned', icon: 'Ban' },
		]
	},
	{
		title: 'Databases',
		items: [
			{ title: 'Pages', url: '/db/pages', icon: 'Database' },
			{ title: 'Users', url: '/db/users', icon: 'Database' },
		]
	},
	{
		title: 'Storage',
		items: [
			{ title: 'Uploads', url: '/r2/uploads', icon: 'Box' },
			{ title: 'User content', url: '/r2/usercontent', icon: 'Box' },
			{ title: 'Videos', url: '/r2/videos', icon: 'Box' },
		]
	},
	{
		title: 'Settings',
		icon: 'Settings',
		items: [
			{ title: 'General', url: '/settings', icon: 'Settings' },
			{ title: 'Appearance', url: '/settings/appearance', icon: 'SwatchBook' },
			{ title: 'Security', url: '/settings/security', icon: 'ShieldCheck' },
		]
	},
	{
		title: 'Tools',
		icon: 'Wrench',
		items: [
			{ title: 'Logs', url: '/tools/logs', icon: 'Scroll' },
			{ title: 'Tasks', url: '/tools/tasks', icon: 'AlarmClockCheck' },
		]
	},
	{
		title: 'Help',
		icon: 'CircleHelp',
		items: [
			{ title: 'Documentation', url: '/help/docs', icon: 'Book' },
			{ title: 'Support', url: '/help/support', icon: 'SquarePen' },
		]
	},
	{
		title: 'About',
		icon: 'Info',
		items: [
			{ title: 'About', url: '/about', icon: 'Info' },
			{ title: 'License', url: '/about/license', icon: 'Info' },
		]
	}
]} />

<main>{@render children()}</main>
