import axios from 'axios';
import { HomeIcon, CalendarIcon, ArchiveBoxIcon, FolderIcon, DocumentDuplicateIcon, ChartPieIcon, UsersIcon, TagIcon, CheckBadgeIcon, ClockIcon, CalendarDaysIcon, DocumentTextIcon, Squares2X2Icon, BanknotesIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const logout = () => {
  const token = Cookies.get('token');
  if (!token) {
    console.log("No token");
  } else {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.post('http://192.168.3.251:3000/auth/logout', {}, { headers: headers })
      .then((response) => {
        Cookies.remove('token');
        localStorage.clear();
        window.location.href = '/';
      })
      .catch((error) => {
        Cookies.remove('token');
        localStorage.clear();
        window.location.href = '/';
      });
  }
};



      const userNavigation = [
        { name: 'Your profile', href: '/profile' },
        { name: 'Sign out', onClick: () => logout()},
      ]
    
      const fullnavigation = [
        { 
          showedname: "Dashboard", 
          options: [
            { name: 'Dashboard', href: '/homepage', icon: HomeIcon, current: false, grants: 'dashboard' },
            { name: 'Rendicontazione', href: '/reporting', icon: ClockIcon, current: false, grants: 'calendar' },
            { name: 'Calendario', href: '/calendar', icon: CalendarDaysIcon, current: false, grants: 'projects' },
          ], 
        },
        {
          showedname: "Analitycs",
          options: [
            { name: 'Report', href: '/report', icon: ChartPieIcon, current: false, grants: 'report' },
          ],
        },
        { 
          showedname: "Project Orders", 
          options: [
            { name: 'Offerte', href: '/offer', icon: DocumentTextIcon, current: false, grants: 'offerte' },
            { name: 'Commesse', href: '/orders', icon: Squares2X2Icon, current: false, grants: 'commesse' },
            { name: 'Archivio Commesse', href: '/orders/archive', icon: ArchiveBoxIcon, current: false, grants: 'archiviocommesse' },
          ], 
        },
        { 
          showedname: "Costs", 
          options: [
            { name: 'Acquisti', href: '#', icon: ShoppingCartIcon, current: false, grants: 'acquisti' },
          ], 
        },
        { 
          showedname: "Registry", 
          options: [
            { name: 'Costi', href: '#', icon: BanknotesIcon, current: false, grants: 'costi' },
            { name: 'Fornitori', href: '#', icon: FolderIcon, current: false, grants: 'fornitori' },
            { name: 'Clienti', href: '#', icon: UsersIcon, current: false, grants: 'clienti' },
            { name: 'Prodotti', href: '#', icon: DocumentDuplicateIcon, current: false, grants: 'prodotti' },
          ], 
        },
        { 
          showedname: "Management", 
          options: [
            { name: 'Users', href: '/users', icon: UsersIcon, current: false, grants: 'users' },
            { name: 'Role', href: '#', icon: TagIcon , current: false, grants: 'role' },
            { name: 'Grants', href: '#', icon: CheckBadgeIcon, current: false, grants: 'grants' },
          ], 
        },
      ];
    
  export { userNavigation, fullnavigation };