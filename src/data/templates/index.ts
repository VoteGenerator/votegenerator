import { EMPLOYEE_TEMPLATES }    from './employee';
import { CUSTOMER_TEMPLATES }    from './customer';
import { EVENTS_TEMPLATES }      from './events';
import { EDUCATION_TEMPLATES }   from './education';
import { PRODUCT_TEMPLATES }     from './product';
import { HEALTHCARE_TEMPLATES }  from './healthcare';
import { COMMUNITY_TEMPLATES }   from './community';
import { FUN_TEMPLATES }         from './fun';
import { HOSPITALITY_TEMPLATES } from './hospitality';
import { SurveyTemplate }        from './_types';

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
    ...EMPLOYEE_TEMPLATES,
    ...CUSTOMER_TEMPLATES,
    ...EVENTS_TEMPLATES,
    ...EDUCATION_TEMPLATES,
    ...PRODUCT_TEMPLATES,
    ...HEALTHCARE_TEMPLATES,
    ...COMMUNITY_TEMPLATES,
    ...FUN_TEMPLATES,
    ...HOSPITALITY_TEMPLATES,
];