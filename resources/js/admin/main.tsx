import './admin.css';
import { installCommerceApi } from './lib/api';
import { registerPages } from './pages';
import { registerFields } from './fields';

installCommerceApi();
registerFields();
registerPages();
