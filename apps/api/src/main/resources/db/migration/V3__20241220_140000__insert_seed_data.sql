-- This migration is now empty since V4 handles the ministerio data
-- V4 will insert all production data including ministerios

-- Add constraints to ensure data integrity
ALTER TABLE membro ADD CONSTRAINT chk_idade CHECK (idade >= 0 AND idade <= 120);
ALTER TABLE membro ADD CONSTRAINT chk_data_nascimento CHECK (data_nascimento <= CURRENT_DATE);