-- Script generated by Aqua Data Studio Schema Synchronization for MS SQL Server 2016 on Mon Apr 04 10:23:32 PDT 2022
-- Execute this script on:
-- 		PSP_PIMS_S25_01/dbo - This database/schema will be modified
-- to synchronize it with MS SQL Server 2016:
-- 		PSP_PIMS_S25_00/dbo

-- We recommend backing up the database prior to executing the script.

SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop index dbo.PRPRTY_ADDRESS_ID_IDX
PRINT N'Drop index dbo.PRPRTY_ADDRESS_ID_IDX'
GO
DROP INDEX [dbo].[PIMS_PROPERTY].[PRPRTY_ADDRESS_ID_IDX]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Alter table dbo.PIMS_PROPERTY_HIST
PRINT N'Alter table dbo.PIMS_PROPERTY_HIST'
GO
UPDATE [dbo].[PIMS_PROPERTY_HIST] SET [ADDRESS_ID] = (SELECT TOP 1 ADDRESS_ID FROM [dbo].[PIMS_ADDRESS_HIST] where STREET_ADDRESS_1 = '940 Blanshard Street') WHERE [ADDRESS_ID] IS NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[PIMS_PROPERTY_HIST] ALTER COLUMN [ADDRESS_ID] bigint NOT NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[PIMS_PROPERTY_HIST] ADD CONSTRAINT [PRPRTYH_ADDRESS_ID_DEF] DEFAULT 1 FOR [ADDRESS_ID]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Alter table dbo.PIMS_PROPERTY
PRINT N'Alter table dbo.PIMS_PROPERTY'
GO
UPDATE [dbo].[PIMS_PROPERTY] SET [ADDRESS_ID] = (SELECT TOP 1 ADDRESS_ID FROM [dbo].[PIMS_ADDRESS_HIST] where STREET_ADDRESS_1 = '940 Blanshard Street') WHERE [ADDRESS_ID] IS NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[PIMS_PROPERTY] ALTER COLUMN [ADDRESS_ID] bigint NOT NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[PIMS_PROPERTY] ADD CONSTRAINT [PRPRTY_ADDRESS_ID_DEF] DEFAULT 1 FOR [ADDRESS_ID]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create index dbo.PRPRTY_ADDRESS_ID_IDX
PRINT N'Create index dbo.PRPRTY_ADDRESS_ID_IDX'
GO
CREATE NONCLUSTERED INDEX [PRPRTY_ADDRESS_ID_IDX]
	ON [dbo].[PIMS_PROPERTY]([ADDRESS_ID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database update failed'
END
GO