import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import { Accordion, AccordionDetails, AccordionSummary, List } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationGroup } from '../../menuItems';
import { NavItem } from './NavItem';

interface NavigationItemGroupProps {
  items: NavigationGroup;
  onClick?: (group: NavigationGroup) => void;
}

const NavItemGroup = ({ items, onClick }: NavigationItemGroupProps) => {
  const location = useLocation();

  const [expandVocationalServices, setExpandVocationalServices] = useState(true);

  return (
    <Accordion
      expanded={expandVocationalServices}
      disableGutters
      elevation={0}
      sx={{
        py: 0,
        ml: '-8px',
        mr: '8px',
        minHeight: 40,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        '::before': {
          top: 0,
          height: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        onClick={() => setExpandVocationalServices(!expandVocationalServices)}
        sx={{ p: 0, pl: '8px', fontSize: '1rem', fontWeight: 500, lineHeight: '27px' }}
      >
        <SupervisedUserCircleOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        Vocational Services
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <List sx={{ p: 0 }}>
          {items.subGroups?.map((group) => (
            <NavItem
              key={group.id}
              selected={group.id === location.hash.replace('#', '')}
              title={group.title}
              sx={{ ml: '0 !important' }}
              onClick={() => onClick && onClick(group)}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default NavItemGroup;
