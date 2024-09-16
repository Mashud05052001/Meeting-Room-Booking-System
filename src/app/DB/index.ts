import config from '../config';
import { userRoles } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const superAdminInfo: TUser = {
  name: 'Mashudur Rahman Mahi',
  email: config.nodemailer_auth_user_email!,
  password: config.super_admin_password!,
  phone: '0164330****',
  address: 'Silver village residential area, Shibbari, South Surma, Sylhet.',
  role: userRoles.superAdmin,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({
    email: config.nodemailer_auth_user_email,
    role: userRoles.superAdmin,
  });
  if (!isSuperAdminExists) {
    await User.create(superAdminInfo);
  }
};

export default seedSuperAdmin;
