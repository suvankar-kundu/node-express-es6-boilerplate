import * as ServiceStates from '../common/constants/serviceState';
import ServiceInstanceModel from '../data/models/serviceInstanceModel';

class ServiceManager {
  constructor (
    serviceDefinitionRepository,
    serviceInstanceRepository
  ) {
    this._serviceDefinitionRepository = serviceDefinitionRepository;
    this._serviceInstanceRepository = serviceInstanceRepository;
  }

  get ServiceDefinitionRepository () {
    return this._serviceDefinitionRepository;
  }

  get ServiceInstanceRepository () {
    return this._serviceInstanceRepository;
  }

  async createService (serviceDefinitionId, user) {
    const serviceDefinition = await this.ServiceDefinitionRepository.getById(serviceDefinitionId);
    if (serviceDefinition) {
      const serviceInstance = await this.ServiceInstanceRepository.create({
        definition: serviceDefinition._id,
        user: user._id,
        state: ServiceStates.NEW
      });
      const serviceDetails = await this.Docker.createService(
        serviceInstance._id.toString(),
        serviceDefinition.definition
      );
      serviceInstance.details = serviceDetails;
      serviceInstance.state = ServiceStates.CREATED;
      await serviceInstance.save();
      return serviceInstance.toObject();
    } else {
      throw new Error('Service definition not found');
    }
  }

  async getServiceById (serviceInstanceId, user) {
    const [serviceInstance] = await this.ServiceInstanceRepository.get({
      _id: serviceInstanceId,
      user: user._id
    });
    return serviceInstance;
  }
}

export default ServiceManager;