import { EMPLOYEE_TEMPLATES }    from './employee';
import { CUSTOMER_TEMPLATES }    from './customer';
import { EVENTS_TEMPLATES }      from './events';
import { EDUCATION_TEMPLATES }   from './education';
import { PRODUCT_TEMPLATES }     from './product';
import { HEALTHCARE_TEMPLATES }  from './healthcare';
import { COMMUNITY_TEMPLATES }   from './community';
import { CIVIC_TEMPLATES }       from './civic';
import { FUN_TEMPLATES }         from './fun';
import { HOSPITALITY_TEMPLATES } from './hospitality';
import { MEMBERSHIP_TEMPLATES }  from './membership';
import { PROCUREMENT_TEMPLATES } from './procurement';
import { PROPERTY_TEMPLATES }    from './property';
import { MARKETING_TEMPLATES }   from './marketing';
import { SurveyTemplate }        from './_types';

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
    ...EMPLOYEE_TEMPLATES,
    ...CUSTOMER_TEMPLATES,
    ...EVENTS_TEMPLATES,
    ...EDUCATION_TEMPLATES,
    ...PRODUCT_TEMPLATES,
    ...HEALTHCARE_TEMPLATES,
    ...COMMUNITY_TEMPLATES,
    ...CIVIC_TEMPLATES,
    ...FUN_TEMPLATES,
    ...HOSPITALITY_TEMPLATES,
    ...MEMBERSHIP_TEMPLATES,
    ...PROCUREMENT_TEMPLATES,
    ...PROPERTY_TEMPLATES,
    ...MARKETING_TEMPLATES,
];