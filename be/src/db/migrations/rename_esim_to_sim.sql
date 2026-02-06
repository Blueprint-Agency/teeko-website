-- Migration: Rename eSIM tables to SIM tables
-- This migration safely renames tables without losing any data

-- Rename the enum types
ALTER TYPE esim_status RENAME TO sim_status;
ALTER TYPE booking_status RENAME TO sim_booking_status;

-- Rename the tables
ALTER TABLE esim_providers RENAME TO sim_providers;
ALTER TABLE esim_packages RENAME TO sim_packages;
ALTER TABLE esim_bookings RENAME TO sim_bookings;

-- Rename the foreign key column in sim_bookings (for consistency)
ALTER TABLE sim_bookings RENAME COLUMN esim_id TO sim_id;
