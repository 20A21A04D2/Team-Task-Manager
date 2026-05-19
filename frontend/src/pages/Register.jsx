import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['Admin', 'Member'], 'Invalid role').required('Role is required'),
});

const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'Member'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await authRegister(data.name, data.email, data.password, data.role);
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-brand-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 sm:px-0 z-10 my-8"
      >
        <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl">
          {/* Logo / Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20 font-heading text-xl mb-4">
              T
            </div>
            <h2 className="text-2xl font-extrabold text-text-heading font-heading tracking-tight">
              Create an Account
            </h2>
            <p className="text-sm text-text-muted mt-2 font-medium">
              Start managing and tracking tasks with your team
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="Alex Johnson"
              error={errors.name}
              {...register('name')}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@company.com"
              error={errors.email}
              {...register('email')}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />

            {/* Role Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                System Role
              </label>
              <select
                id="role"
                className={`w-full px-4 py-2.5 bg-bg-surface border ${
                  errors.role ? 'border-red-500 focus:ring-red-500/20' : 'border-border-color focus:border-brand-500 focus:ring-brand-500/20'
                } rounded-lg text-text-heading placeholder-text-muted focus:outline-none focus:ring-4 transition duration-200`}
                {...register('role')}
              >
                <option value="Member">Team Member</option>
                <option value="Admin">Administrator</option>
              </select>
              {errors.role && (
                <span className="text-xs text-red-400 mt-0.5 font-medium">
                  {errors.role.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-4"
              loading={loading}
            >
              Get Started
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-5">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 hover:text-brand-600 font-semibold transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
