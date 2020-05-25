


-- - Updated By / Date   - Praveen Yadav /  29 April 2020

 

-- Description - This  is been used for alter Country table to include tax
-- Updated - 29 April 2020 - [column added]


alter table [dbo].[Country]
add Tax int ;

update  [dbo].[FormField]
set [isRequired]=0
where [DBFieldName]='tax'