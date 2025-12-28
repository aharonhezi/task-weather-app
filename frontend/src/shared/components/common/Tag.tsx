import React from 'react';
import styles from './Tag.module.css';

type TagVariant = 'Low' | 'Medium' | 'High' | 'Not urgent' | 'Urgent';

interface TagProps {
  variant: TagVariant;
  children: React.ReactNode;
}

const getTagClass = (variant: TagVariant): string => {
  switch (variant) {
    case 'Low':
    case 'Not urgent':
      return styles.low;
    case 'Medium':
      return styles.medium;
    case 'High':
    case 'Urgent':
      return styles.high;
    default:
      return styles.low;
  }
};

export const Tag: React.FC<TagProps> = ({ variant, children }) => {
  return (
    <span className={`${styles.tag} ${getTagClass(variant)}`}>
      {children}
    </span>
  );
};

