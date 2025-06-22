import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { FilterOptions } from '../types/token';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClose: () => void;
}

const FilterOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.overlay};
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FilterPanel = styled(motion.div)`
  background: ${props => props.theme.colors.modal};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.elevated};
    border-color: ${props => props.theme.colors.error};
  }
  
  svg {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GroupLabel = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SearchInputContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.base};
  transition: ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textMuted};
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.base};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

const RangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RangeInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.base};
  transition: ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const SortContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;
`;

const SortButton = styled(motion.button)<{ active: boolean }>`
  padding: 1rem;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.elevated};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary};
    border: 1px solid ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  ` : `
    background: ${props.theme.colors.surface};
    border: 1px solid ${props.theme.colors.border};
    color: ${props.theme.colors.textSecondary};
    
    &:hover {
      background: ${props.theme.colors.elevated};
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

const categories = [
          'Alpha Hunters',
        'Moon Scouts',
        'Diamond Watch',
  'New Launch',
  'Trending',
  'Featured'
];

const sortOptions = [
  { value: 'createdAt', label: 'Created Time' },
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'performanceChange', label: 'Performance' },
        { value: 'alphaScore', label: 'AlphaScore' },
  { value: 'volume24h', label: '24h Volume' }
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onClose
}) => {
  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      minMarketCap: 0,
      maxMarketCap: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <FilterOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <FilterPanel
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <FilterHeader>
          <FilterTitle>
            <SlidersHorizontal size={20} />
            Search & Filters
          </FilterTitle>
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} />
          </CloseButton>
        </FilterHeader>

        <FilterContent>
          <FilterGroup>
            <GroupLabel>Search Tokens</GroupLabel>
            <SearchInputContainer>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by token name or symbol..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
              />
            </SearchInputContainer>
          </FilterGroup>

          <FilterGroup>
            <GroupLabel>Category</GroupLabel>
            <Select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <GroupLabel>Market Cap Range</GroupLabel>
            <RangeContainer>
              <RangeInput
                type="number"
                placeholder="Min Market Cap"
                value={filters.minMarketCap || ''}
                onChange={(e) => onFilterChange({ minMarketCap: Number(e.target.value) || 0 })}
              />
              <RangeInput
                type="number"
                placeholder="Max Market Cap"
                value={filters.maxMarketCap || ''}
                onChange={(e) => onFilterChange({ maxMarketCap: Number(e.target.value) || 0 })}
              />
            </RangeContainer>
          </FilterGroup>

          <FilterGroup>
            <GroupLabel>Sort By</GroupLabel>
            <SortContainer>
              <Select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <SortButton
                active={filters.sortOrder === 'desc'}
                onClick={() => onFilterChange({ 
                  sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' 
                })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filters.sortOrder === 'desc' ? '↓ DESC' : '↑ ASC'}
              </SortButton>
            </SortContainer>
          </FilterGroup>
        </FilterContent>

        <ActionButtons>
          <ActionButton
            variant="secondary"
            onClick={handleClearFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear All
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Apply Filters
          </ActionButton>
        </ActionButtons>
      </FilterPanel>
    </FilterOverlay>
  );
};

export default SearchFilters; 