DECLARE @restricted BIGINT;
SELECT @restricted = ROLE_ID FROM PIMS_ROLE WHERE NAME = 'Functional (Restricted)';

DECLARE @researchAdd BIGINT;
select @researchAdd = CLAIM_ID FROM PIMS_CLAIM WHERE NAME = 'researchfile-add';

INSERT [dbo].[PIMS_ROLE_CLAIM] ([ROLE_ID], [CLAIM_ID], [IS_DISABLED], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_TIMESTAMP], [DB_CREATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [DB_LAST_UPDATE_USERID]) VALUES (@restricted, @researchAdd, 0, 1, CAST(N'2021-11-10T02:17:49.920' AS DateTime), N'SEED', NULL, N'SEED', CAST(N'2021-11-10T02:17:49.920' AS DateTime), N'SEED', NULL, N'SEED', CAST(N'2021-11-10T02:17:49.920' AS DateTime), N'SEED', CAST(N'2021-11-10T02:17:49.920' AS DateTime), N'SEED')

GO