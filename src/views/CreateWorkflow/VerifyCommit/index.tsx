import { Divider, IconButton, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import cronstrue from 'cronstrue';
import YAML from 'yaml';
import AdjustedWeights from '../../../components/AdjustedWeights';
import ButtonFilled from '../../../components/Button/ButtonFilled';
import ButtonOutline from '../../../components/Button/ButtonOutline/index';
import CustomText from '../../../components/CustomText';
import YamlEditor from '../../../components/YamlEditor/Editor';
import {
  AceValidations,
  parseYamlValidations,
} from '../../../components/YamlEditor/Validations';
import Unimodal from '../../../containers/layouts/Unimodal';
import { experimentMap, WorkflowData } from '../../../models/redux/workflow';
import useActions from '../../../redux/actions';
import * as WorkflowActions from '../../../redux/actions/workflow';
import { RootState } from '../../../redux/reducers';
import useStyles from './styles';

interface VerifyCommitProps {
  gotoStep: (page: number) => void;
}

const VerifyCommit: React.FC<VerifyCommitProps> = ({ gotoStep }) => {
  const classes = useStyles();

  const workflow = useActions(WorkflowActions);

  const workflowData: WorkflowData = useSelector(
    (state: RootState) => state.workflowData
  );

  const {
    name,
    link,
    yaml,
    id,
    description,
    weights,
    cronSyntax,
  } = workflowData;

  const [open, setOpen] = React.useState(false);

  const [yamlStatus, setYamlStatus] = React.useState(
    'Your code is fine. You can move on!'
  );

  const [modified, setModified] = React.useState(false);

  const handleOpen = () => {
    setModified(false);
    setOpen(true);
  };

  const handleClose = () => {
    setModified(true);
    setOpen(false);
  };

  const handleNameChange = ({ changedName }: { changedName: string }) => {
    const parsedYaml = YAML.parse(yaml);
    parsedYaml.metadata.name = changedName;
    const nameMappedYaml = YAML.stringify(parsedYaml);
    workflow.setWorkflowDetails({
      name: changedName,
      yaml: nameMappedYaml,
    });
  };

  const handleDescChange = ({ changedDesc }: { changedDesc: string }) => {
    workflow.setWorkflowDetails({
      description: changedDesc,
    });
  };

  const WorkflowTestData: experimentMap[] = weights as any;

  useEffect(() => {
    let editorValidations: AceValidations = {
      markers: [],
      annotations: [],
    };
    editorValidations = parseYamlValidations(yaml, classes);
    const stateObject = {
      markers: editorValidations.markers,
      annotations: editorValidations.annotations,
    };
    if (stateObject.annotations.length > 0) {
      setYamlStatus('Error in CRD Yaml.');
    } else {
      setYamlStatus('Your code is fine. You can move on !');
    }
  }, [modified]);

  // const preventDefault = (event: React.SyntheticEvent) =>
  //  event.preventDefault();
  return (
    <div>
      <div className={classes.root}>
        <div className={classes.suHeader}>
          <div className={classes.suBody}>
            <Typography className={classes.headerText}>
              <strong> Confirmation of Results</strong>
            </Typography>
            <Typography className={classes.description}>
              Before committing the workflow changes to your, verify and if
              needed go back to a corresponding section of the wizard to modify.
            </Typography>
          </div>
          <img
            src="./icons/b-finance.png"
            alt="bfinance"
            className={classes.bfinIcon}
          />
        </div>
        <Divider />

        <Typography className={classes.sumText}>
          <strong>Summary</strong>
        </Typography>

        <div className={classes.outerSum}>
          <div className={classes.summaryDiv}>
            <div className={classes.innerSumDiv}>
              <Typography className={classes.col1}>Workflow name:</Typography>
            </div>
            <div className={classes.col2}>
              <CustomText
                value={name}
                id="name"
                onchange={(changedName: string) =>
                  handleNameChange({ changedName })
                }
              />
            </div>
          </div>
          <div className={classes.summaryDiv}>
            <div className={classes.innerSumDiv}>
              <Typography className={classes.col1}>Description:</Typography>
            </div>
            <div
              className={classes.col2}
              style={{
                width: 724,
              }}
            >
              <CustomText
                value={description}
                id="desc"
                onchange={(changedDesc: string) =>
                  handleDescChange({ changedDesc })
                }
              />
            </div>
          </div>
          <div className={classes.summaryDiv}>
            <div className={classes.innerSumDiv}>
              <Typography className={classes.col1}>Schedule:</Typography>
            </div>
            <div className={classes.schCol2}>
              {/* <CustomDate disabled={edit} />
              <CustomTime
                handleDateChange={handleDateChange}
                value={selectedDate}
                ampm
                disabled={edit}
              /> */}
              {cronSyntax === '' ? (
                <Typography className={classes.schedule}>
                  Scheduling now
                </Typography>
              ) : (
                <Typography className={classes.schedule}>
                  {cronstrue.toString(cronSyntax)}
                </Typography>
              )}

              <div className={classes.editButton1}>
                <IconButton onClick={() => gotoStep(4)}>
                  <EditIcon className={classes.editbtn} data-cy="edit" />
                </IconButton>
              </div>
            </div>
          </div>
          <div className={classes.summaryDiv}>
            <div className={classes.innerSumDiv}>
              <Typography className={classes.col1}>
                Adjusted Weights:
              </Typography>
            </div>
            {weights.length === 0 ? (
              <div>
                <Typography className={classes.errorText}>
                  <strong>
                    Invalid Workflow CRD found ! Please correct the errors.
                  </strong>
                </Typography>
              </div>
            ) : (
              <div className={classes.adjWeights}>
                <div className={classes.progress} style={{ flexWrap: 'wrap' }}>
                  {WorkflowTestData.map((Test) => (
                    <AdjustedWeights
                      key={Test.weight}
                      testName={`${Test.experimentName} test`}
                      testValue={Test.weight}
                      spacing={false}
                      icon={false}
                    />
                  ))}
                </div>
                {/* <div className={classes.editButton2}> */}
                <ButtonOutline
                  isDisabled={false}
                  handleClick={() => gotoStep(3)}
                  data-cy="testRunButton"
                >
                  <Typography className={classes.buttonOutlineText}>
                    Edit
                  </Typography>
                </ButtonOutline>
                {/* </div> */}
              </div>
            )}
          </div>
          <div className={classes.summaryDiv}>
            <div className={classes.innerSumDiv}>
              <Typography className={classes.col1}>YAML:</Typography>
            </div>
            <div className={classes.yamlFlex}>
              {weights.length === 0 ? (
                <Typography> Error in CRD Yaml. </Typography>
              ) : (
                <Typography>{yamlStatus}</Typography>
              )}
              <div className={classes.yamlButton}>
                <ButtonFilled handleClick={handleOpen} isPrimary>
                  <div>View YAML</div>
                </ButtonFilled>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        {/*
        <div>
          <Typography className={classes.config}>
            The configuration details of this workflow will be committed to:{' '}
            <span>
              <Link
                href="https://github.com/abcorn-org/reputeops/sandbox-repute.yaml"
                onClick={preventDefault}
                className={classes.link}
              >
                https://github.com/abcorn-org/reputeops/sandbox-repute.yaml
              </Link>
            </span>
          </Typography>
        </div>
        */}
      </div>

      <Unimodal
        isOpen={open}
        handleClose={handleClose}
        hasCloseBtn
        isDark
        textAlign="left"
      >
        <YamlEditor
          content={yaml}
          filename={name}
          yamlLink={link}
          id={id}
          description={description}
          readOnly
        />
      </Unimodal>
    </div>
  );
};

export default VerifyCommit;
